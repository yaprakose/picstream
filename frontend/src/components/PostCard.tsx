import { motion } from "framer-motion";
import { Heart, MessageCircle, Trash2, Send, X } from "lucide-react";
import { useState } from "react";

export interface Comment {
  id: string;
  email: string;
  content: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  email: string;
  caption: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  createdAt: Date;
  isOwner: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onDelete: (postId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  currentUser: string | null;
}

const formatDate = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Şimdi";
  if (diffMins < 60) return `${diffMins}dk`;
  if (diffHours < 24) return `${diffHours}sa`;
  if (diffDays < 7) return `${diffDays}g`;
  return new Date(date).toLocaleDateString("tr-TR");
};

const PostCard = ({
  post,
  onLike,
  onComment,
  onDelete,
  onDeleteComment,
  currentUser,
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText("");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl sm:rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <header className="p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary to-pink-500 flex items-center justify-center font-semibold text-sm sm:text-base">
            {post.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-sm">
              {post.email.split("@")[0]}
            </h4>
            <span className="text-xs text-muted-foreground">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        {post.isOwner && (
          <button
            onClick={() => onDelete(post.id)}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* Media */}
      <div className="bg-secondary">
        {post.mediaType === "video" ? (
          <video
            src={post.mediaUrl}
            controls
            className="w-full max-h-[600px] object-contain"
          />
        ) : (
          <img
            src={post.mediaUrl}
            alt={post.caption}
            className="w-full max-h-[600px] object-contain"
          />
        )}
      </div>

      {/* Actions */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-1 mb-3">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all ${
              post.isLiked
                ? "text-red-500 bg-red-500/10"
                : "hover:bg-secondary"
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-transform ${
                post.isLiked ? "fill-current scale-110" : ""
              }`}
            />
            <span className="font-medium">{post.likes}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{post.comments.length}</span>
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm mb-3">
            <span className="font-semibold mr-2">
              {post.email.split("@")[0]}
            </span>
            {post.caption}
          </p>
        )}

        {/* Comments Section */}
        {post.comments.length > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {post.comments.length} yorumu görüntüle
          </button>
        )}

        {showComments && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            {post.comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {comment.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold mr-2">
                      {comment.email.split("@")[0]}
                    </span>
                    {comment.content}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                {currentUser === comment.email && (
                  <button
                    onClick={() => onDeleteComment(post.id, comment.id)}
                    className="p-1 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {/* Comment Form */}
            <form
              onSubmit={handleSubmitComment}
              className="flex items-center gap-2 mt-4"
            >
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Yorum yaz..."
                className="flex-1 px-4 py-2 bg-secondary border border-border rounded-full text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-2 bg-primary rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {!showComments && (
          <form
            onSubmit={handleSubmitComment}
            className="flex items-center gap-2 mt-4 pt-4 border-t border-border"
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Yorum yaz..."
              className="flex-1 px-4 py-2 bg-secondary border border-border rounded-full text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 bg-primary rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </motion.article>
  );
};

export default PostCard;
