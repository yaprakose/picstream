import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image, Video, Send } from "lucide-react";

interface CreatePostProps {
  onPost: (file: File, caption: string) => void;
  isLoggedIn: boolean;
}

const CreatePost = ({ onPost, isLoggedIn }: CreatePostProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsVideo(selectedFile.type.startsWith("video/"));
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setIsVideo(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onPost(file, caption);
      setFile(null);
      setPreview(null);
      setCaption("");
      setIsVideo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <div className="text-center text-muted-foreground">
          <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Sign in to share posts</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-5"
    >
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <Upload className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Create Post</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!preview ? (
          <label className="block border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex justify-center gap-4 mb-3">
              <Image className="w-8 h-8 text-muted-foreground" />
              <Video className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-medium">Click</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Image or Video
            </p>
          </label>
        ) : (
          <div className="relative rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 z-10 p-2 bg-black/70 rounded-full hover:bg-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {isVideo ? (
              <video
                src={preview}
                controls
                className="w-full max-h-60 object-cover"
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-60 object-cover"
              />
            )}
          </div>
        )}

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="w-full px-4 py-3 bg-secondary border border-border rounded-xl resize-none h-24 focus:outline-none focus:border-primary transition-colors"
        />

        <button
          type="submit"
          disabled={!file}
          className="w-full py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Send className="w-4 h-4" />
          Share
        </button>
      </form>
    </motion.div>
  );
};

export default CreatePost;
