import { motion } from "framer-motion";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ loginIdentifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login", formData);
      setUser(res.data.user);
      toast.success("User successfully logged in! Redirecting...");
      navigate(res.data.user.role === "user" ? "/user/dashboard" : "/provider/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      toast.error("Login failed - check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080C1C] text-white relative overflow-hidden">
      <Link to="/" className="absolute top-11 left-11 text-[#2DD4BF] font-bold text-lg z-10">
        ← Back to Dashboard
      </Link>
      
      {/* Background Aurora Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[700px] h-[700px] top-[10%] right-[-10%] rounded-full bg-[#F59E0B]/10 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[600px] h-[600px] bottom-[-10%] left-[-10%] rounded-full bg-[#2DD4BF]/10 blur-[100px]"
        />
      </div>

      {/* Floating Badge Reference */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-20 right-10 hidden lg:flex bg-[#080C1C]/60 backdrop-blur-xl border border-[#2DD4BF]/30 p-4 rounded-2xl gap-3 shadow-2xl"
      >
        <div className="w-10 h-10 bg-[#2DD4BF] rounded-lg flex items-center justify-center text-black">✦</div>
        <div>
          <p className="text-sm font-bold">Secure Access</p>
          <p className="text-[10px] text-white/40">Verified by ServiceHub Auth</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black font-serif tracking-tighter mb-3 italic">Welcome Back</h2>
            <p className="text-white/40 font-medium">Continue your service journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <input
                type="text"
                name="loginIdentifier"
                placeholder="Email or Username"
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#2DD4BF]/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                required
              />
            </div>
            <div className="space-y-1">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#2DD4BF]/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                required
              />
            </div>

            {error && <p className="text-center text-[#FB923C] text-sm font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-[#080C1C] font-bold rounded-2xl hover:bg-[#2DD4BF] transition-colors shadow-xl disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Sign In →"}
            </button>
          </form>

          <p className="text-center mt-10 text-sm text-white/30">
            Need an account? <Link to="/register/user" className="text-white hover:text-[#2DD4BF] transition-colors font-bold underline underline-offset-4">Register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export { Login };