import { motion } from "framer-motion";
import { Flame, ImageOff, LogIn, Lock } from "lucide-react";
import PostCard, { Post } from "./PostCard";

interface FeedProps {
  posts: Post[];
  loading: boolean;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onDelete: (postId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  currentUser: string | null;
  isLoggedIn: boolean;
}

const Feed = ({
  posts,
  loading,
  onLike,
  onComment,
  onDelete,
  onDeleteComment,
  currentUser,
  isLoggedIn,
}: FeedProps) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Flame className="w-6 h-6 text-pink-500" />
          <h2 className="text-xl font-bold">Feed</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // For users not logged in
  if (!isLoggedIn) {
    return (
      <div className="space-y-4 sm:space-y-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 pb-4 border-b border-border"
        >
          <Flame className="w-6 h-6 text-pink-500" />
          <h2 className="text-xl font-bold">Feed</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary/20 to-pink-500/20 flex items-center justify-center mb-6">
            <Lock className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-3">Sign In to Access Feed</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Sign in to your account or create a new one to view posts, like and comment.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LogIn className="w-4 h-4" />
            <span>Use the "Login" button in the top right</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 pb-4 border-b border-border"
      >
        <Flame className="w-6 h-6 text-pink-500" />
        <h2 className="text-xl font-bold">Feed</h2>
      </motion.div>

      {posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <ImageOff className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
          <p className="text-muted-foreground">
            Be the first to share a post!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard
                post={post}
                onLike={onLike}
                onComment={onComment}
                onDelete={onDelete}
                onDeleteComment={onDeleteComment}
                currentUser={currentUser}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
