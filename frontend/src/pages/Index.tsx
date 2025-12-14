import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CreatePost from "@/components/CreatePost";
import TrendingCard from "@/components/TrendingCard";
import Feed from "@/components/Feed";
import { Post, Comment } from "@/components/PostCard";
import { toast } from "sonner";

const API_URL = "http://localhost:8000";

const Index = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Fetch posts on mount and when token changes
  useEffect(() => {
    loadFeed();
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser({ email: userData.email });
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const loadFeed = async () => {
    try {
      setLoading(true);
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/feed`, { headers });
      if (response.ok) {
        const data = await response.json();
        const formattedPosts: Post[] = data.posts.map((post: any) => ({
          id: post.id,
          email: post.email,
          caption: post.caption || "",
          mediaUrl: post.url,
          mediaType: post.file_type === "video" ? "video" : "image",
          likes: post.like_count || 0,
          isLiked: post.is_liked || false,
          comments: (post.comments || []).map((c: any) => ({
            id: c.id,
            email: c.email,
            content: c.content,
            createdAt: new Date(c.created_at),
          })),
          createdAt: new Date(post.created_at),
          isOwner: post.is_owner || false,
        }));
        setPosts(formattedPosts);
      }
    } catch (error) {
      console.error("Failed to load feed:", error);
      toast.error("Feed yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(`${API_URL}/auth/jwt/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        setToken(data.access_token);
        setUser({ email });
        toast.success("Hoş geldiniz!");
        loadFeed();
      } else {
        toast.error("Geçersiz e-posta veya şifre");
      }
    } catch (error) {
      toast.error("Giriş başarısız");
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast.success("Hesabınız oluşturuldu! Giriş yapabilirsiniz.");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Kayıt başarısız");
      }
    } catch (error) {
      toast.error("Kayıt başarısız");
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/auth/jwt/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    loadFeed();
    toast.success("Çıkış yapıldı");
  };

  const handlePost = async (file: File, caption: string) => {
    if (!token) {
      toast.error("Gönderi paylaşmak için giriş yapın");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        toast.success("Gönderi paylaşıldı!");
        loadFeed();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Yükleme başarısız");
      }
    } catch (error) {
      toast.error("Yükleme başarısız");
    }
  };

  const handleLike = async (postId: string) => {
    if (!token) {
      toast.error("Beğenmek için giriş yapın");
      return;
    }

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    try {
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: post.isLiked ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(
          posts.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                likes: data.like_count,
                isLiked: !p.isLiked,
              };
            }
            return p;
          })
        );
      }
    } catch (error) {
      toast.error("İşlem başarısız");
    }
  };

  const handleComment = async (postId: string, content: string) => {
    if (!token) {
      toast.error("Yorum yapmak için giriş yapın");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", content);

      const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newComment: Comment = {
          id: data.comment.id,
          email: data.comment.email,
          content: data.comment.content,
          createdAt: new Date(data.comment.created_at),
        };

        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [...post.comments, newComment],
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      toast.error("Yorum eklenemedi");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Bu gönderiyi silmek istediğinize emin misiniz?")) return;

    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
        toast.success("Gönderi silindi");
      } else {
        toast.error("Silme başarısız");
      }
    } catch (error) {
      toast.error("Silme başarısız");
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: post.comments.filter((c) => c.id !== commentId),
              };
            }
            return post;
          })
        );
        toast.success("Yorum silindi");
      }
    } catch (error) {
      toast.error("Yorum silinemedi");
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 sm:gap-8 overflow-hidden">
          {/* Sidebar - hidden on mobile, shown at bottom */}
          <aside className="order-2 lg:order-1 lg:sticky lg:top-24 lg:h-fit space-y-4 sm:space-y-5">
            <div className="lg:block hidden">
              <CreatePost onPost={handlePost} isLoggedIn={!!user} />
            </div>
            <div className="hidden sm:block">
              <TrendingCard />
            </div>
          </aside>

          {/* Feed */}
          <section className="order-1 lg:order-2">
            {/* Mobile Create Post */}
            <div className="lg:hidden mb-4">
              <CreatePost onPost={handlePost} isLoggedIn={!!user} />
            </div>
            <Feed
              posts={posts}
              loading={loading}
              onLike={handleLike}
              onComment={handleComment}
              onDelete={handleDeletePost}
              onDeleteComment={handleDeleteComment}
              currentUser={user?.email || null}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
