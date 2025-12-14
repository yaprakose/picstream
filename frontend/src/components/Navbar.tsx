import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, LogIn, LogOut, UserPlus, X, User } from "lucide-react";

interface NavbarProps {
  user: { email: string } | null;
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
  onLogout: () => void;
}

const Navbar = ({ user, onLogin, onRegister, onLogout }: NavbarProps) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
    setShowLoginModal(false);
    setEmail("");
    setPassword("");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(email, password);
    setShowRegisterModal(false);
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-border z-50 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between overflow-hidden">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Flame className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              Picstream
            </span>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            {user ? (
              <>
                <div className="flex items-center gap-2 px-2 sm:px-4 py-2 bg-card rounded-full border border-border">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-primary to-pink-500 flex items-center justify-center text-sm font-semibold">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:block text-sm font-medium">Login</span>
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:block text-sm font-medium">Sign Up</span>
                </button>
              </>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold">Welcome Back</h2>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleLogin} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-colors"
                >
                  Sign In
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register Modal */}
      <AnimatePresence>
        {showRegisterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowRegisterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold">Create Account</h2>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleRegister} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-colors"
                >
                  Sign Up
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
