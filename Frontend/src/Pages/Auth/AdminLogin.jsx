import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND}/api/auth/admin-login`, {
        email,
        password,
      });
      setUser(res.data.user);
      toast.success("Admin authenticated successfully! Redirecting...");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Admin authentication failed");
      toast.error("Admin authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080C1C] text-white relative overflow-hidden font-sans">
      <Link to="/" className="absolute top-11 left-11 text-[#2DD4BF] font-bold text-lg z-10">
        ← Back to Dashboard
      </Link>
      
      {/* Aurora Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#2DD4BF]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#F59E0B]/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-1"
      >
        <div className="bg-[#080C1C]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-gradient-to-tr from-[#2DD4BF] to-[#F59E0B] rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(45,212,191,0.3)]"
            >
              ◈
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 font-serif">Admin Portal</h2>
            <p className="text-white/40 text-sm">Secure access for ServiceHub administrators</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-white/50 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@servicehub.com"
                required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-[#2DD4BF]/50 focus:bg-white/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-white/50 ml-1">Secret Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-[#2DD4BF]/50 focus:bg-white/10 transition-all"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[#FB923C] text-sm text-center bg-[#FB923C]/10 py-2 rounded-lg border border-[#FB923C]/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] font-bold rounded-xl shadow-lg shadow-[#2DD4BF]/20 disabled:opacity-50 transition-all"
            >
              {loading ? "Verifying..." : "Authorize Access →"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export { AdminLogin };