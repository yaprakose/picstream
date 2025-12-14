import { motion } from "framer-motion";
import { Flame, ImageOff } from "lucide-react";
import PostCard, { Post } from "./PostCard";

interface FeedProps {
  posts: Post[];
  loading: boolean;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onDelete: (postId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  currentUser: string | null;
}

const Feed = ({
  posts,
  loading,
  onLike,
  onComment,
  onDelete,
  onDeleteComment,
  currentUser,
}: FeedProps) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Flame className="w-6 h-6 text-pink-500" />
          <h2 className="text-xl font-bold">Akış</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
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
        <h2 className="text-xl font-bold">Akış</h2>
      </motion.div>

      {posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <ImageOff className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Henüz gönderi yok</h3>
          <p className="text-muted-foreground">
            İlk gönderiyi paylaşan siz olun!
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
