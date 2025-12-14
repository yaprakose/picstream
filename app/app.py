from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import PostCreate, PostResponse, UserRead, UserCreate, UserUpdate
from app.db import Post, create_db_and_tables, get_async_session, User, Like, Comment
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from sqlalchemy import select, func, and_
from app.images import imagekit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions
import shutil
import os
import uuid
import tempfile
from app.users import auth_backend, current_active_user, fastapi_users


@asynccontextmanager
async def lifespan(app:FastAPI):
    await create_db_and_tables()
    yield

app = FastAPI(
    title="Picstream API",
    description="A modern social media API with image/video sharing",
    version="1.0.0",
    lifespan=lifespan
)

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(fastapi_users.get_auth_router(auth_backend), prefix='/auth/jwt', tags=["auth"])
app.include_router(fastapi_users.get_register_router(UserRead, UserCreate), prefix="/auth", tags=["auth"])
app.include_router(fastapi_users.get_reset_password_router(), prefix="/auth", tags=["auth"])
app.include_router(fastapi_users.get_verify_router(UserRead), prefix="/auth", tags=["auth"])
app.include_router(fastapi_users.get_users_router(UserRead, UserUpdate), prefix="/users", tags=["users"])

@app.post("/upload")
async def upload_file(
        file: UploadFile = File(...),
        caption: str = Form(""),
        user: User = Depends(current_active_user),
        session: AsyncSession = Depends(get_async_session)
):
    temp_file_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file_path = temp_file.name
            shutil.copyfileobj(file.file, temp_file)

        upload_result = imagekit.upload_file(
            file=open(temp_file_path, "rb"),
            file_name=file.filename,
            options=UploadFileRequestOptions(
                use_unique_file_name=True,
                tags=["backend-upload"]
            )
        )

        if upload_result.response_metadata.http_status_code == 200:
            post = Post(
                user_id=str(user.id),
                caption=caption,
                url=upload_result.url,
                file_type="video" if file.content_type.startswith("video/") else "image",
                file_name=upload_result.name
            )
            session.add(post)
            await session.commit()
            await session.refresh(post)
            return post

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        file.file.close()

@app.get("/feed")
async def get_feed(
        session: AsyncSession = Depends(get_async_session),
        user: User = Depends(current_active_user),
):
    result = await session.execute(select(Post).order_by(Post.created_at.desc()))
    posts = [row[0] for row in result.all()]

    result = await session.execute(select(User))
    users = [row[0] for row in result.all()]
    user_dict = {str(u.id): u.email for u in users}

    posts_data = []
    for post in posts:
        
        like_count_result = await session.execute(
            select(func.count(Like.id)).where(Like.post_id == post.id)
        )
        like_count = like_count_result.scalar() or 0

        
        user_like_result = await session.execute(
            select(Like).where(and_(Like.post_id == post.id, Like.user_id == str(user.id)))
        )
        is_liked = user_like_result.scalars().first() is not None

        
        comments_result = await session.execute(
            select(Comment).where(Comment.post_id == post.id).order_by(Comment.created_at.asc())
        )
        comments = [row[0] for row in comments_result.all()]
        comments_data = [
            {
                "id": str(c.id),
                "user_id": str(c.user_id),
                "content": c.content,
                "email": user_dict.get(str(c.user_id), "Unknown"),
                "created_at": c.created_at.isoformat()
            }
            for c in comments
        ]

        posts_data.append(
            {
                "id": str(post.id),
                "user_id": str(post.user_id),
                "caption": post.caption,
                "url": post.url,
                "file_type": post.file_type,
                "file_name": post.file_name,
                "created_at": post.created_at.isoformat(),
                "is_owner": str(post.user_id) == str(user.id),
                "email": user_dict.get(str(post.user_id), "Unknown"),
                "like_count": like_count,
                "is_liked": is_liked,
                "comments": comments_data
            }
        )

    return {"posts": posts_data}


@app.delete("/posts/{post_id}")
async def delete_post(post_id: str, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_active_user),):
    try:
        result = await session.execute(select(Post).where(Post.id == post_id))
        post = result.scalars().first()

        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        if str(post.user_id) != str(user.id):
            raise HTTPException(status_code=403, detail="You don't have permission to delete this post")

        await session.delete(post)
        await session.commit()

        return {"success": True, "message": "Post deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid post ID")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@app.post("/posts/{post_id}/like")
async def like_post(
    post_id: str,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    
    result = await session.execute(select(Post).where(Post.id == post_id))
    post = result.scalars().first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    
    existing_like = await session.execute(
        select(Like).where(and_(Like.post_id == post_id, Like.user_id == str(user.id)))
    )
    if existing_like.scalars().first():
        raise HTTPException(status_code=400, detail="Already liked")

    
    like = Like(user_id=str(user.id), post_id=post_id)
    session.add(like)
    await session.commit()

    
    count_result = await session.execute(
        select(func.count(Like.id)).where(Like.post_id == post_id)
    )
    like_count = count_result.scalar() or 0

    return {"success": True, "like_count": like_count}


@app.delete("/posts/{post_id}/like")
async def unlike_post(
    post_id: str,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    
    result = await session.execute(
        select(Like).where(and_(Like.post_id == post_id, Like.user_id == str(user.id)))
    )
    like = result.scalars().first()
    
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")

    await session.delete(like)
    await session.commit()

   
    count_result = await session.execute(
        select(func.count(Like.id)).where(Like.post_id == post_id)
    )
    like_count = count_result.scalar() or 0

    return {"success": True, "like_count": like_count}




@app.post("/posts/{post_id}/comments")
async def add_comment(
    post_id: str,
    content: str = Form(...),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    # Check if post exists
    result = await session.execute(select(Post).where(Post.id == post_id))
    post = result.scalars().first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Create comment
    comment = Comment(
        user_id=str(user.id),
        post_id=post_id,
        content=content
    )
    session.add(comment)
    await session.commit()
    await session.refresh(comment)

    return {
        "success": True,
        "comment": {
            "id": str(comment.id),
            "user_id": str(comment.user_id),
            "content": comment.content,
            "email": user.email,
            "created_at": comment.created_at.isoformat()
        }
    }


@app.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: str,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    result = await session.execute(select(Comment).where(Comment.id == comment_id))
    comment = result.scalars().first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if str(comment.user_id) != str(user.id):
        raise HTTPException(status_code=403, detail="Not authorized")

    await session.delete(comment)
    await session.commit()

    return {"success": True, "message": "Comment deleted"}