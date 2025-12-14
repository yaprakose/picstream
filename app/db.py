from collections.abc import AsyncGenerator
import uuid

from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, relationship
from datetime import datetime
from fastapi_users.db import SQLAlchemyUserDatabase, SQLAlchemyBaseUserTableUUID
from fastapi import Depends

DATABASE_URL = "sqlite+aiosqlite:///./test.db"



class Base(DeclarativeBase):
    pass



class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"

    posts = relationship("Post", back_populates="user")
    likes = relationship("Like", back_populates="user")
    comments = relationship("Comment", back_populates="user")



class Post(Base):
    __tablename__ = "posts"

    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    user_id = Column(
        String,
        ForeignKey("users.id"),   
        nullable=False
    )

    caption = Column(Text)
    url = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="posts")
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")


# Like Model
class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    post_id = Column(String, ForeignKey("posts.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="likes")
    post = relationship("Post", back_populates="likes")

    __table_args__ = (UniqueConstraint('user_id', 'post_id', name='unique_user_post_like'),)


# Comment Model
class Comment(Base):
    __tablename__ = "comments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    post_id = Column(String, ForeignKey("posts.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")


engine = create_async_engine(DATABASE_URL, echo=False)

async_session_maker = async_sessionmaker(engine, expire_on_commit=False)


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)



async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)

