import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:3000/api/auth/register/user", formData);
      
      toast.success("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080C1C] text-white relative overflow-hidden py-12">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#2DD4BF]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-[120px]" />

      <Link to="/" className="absolute top-11 left-11 text-[#2DD4BF] font-bold text-lg z-10">
        ← Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px] px-6 relative z-10"
      >
        <div className="bg-[#0D1226]/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <span className="text-[#2DD4BF] text-xs font-bold tracking-[0.2em] uppercase">Get Started</span>
            <h2 className="text-4xl font-bold font-serif mt-2">Create Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#2DD4BF]/50 focus:bg-white/10 transition-all"
              />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#2DD4BF]/50 focus:bg-white/10 transition-all"
              />
              <input
                name="password"
                type="password"
                placeholder="Create password"
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#2DD4BF]/50 focus:bg-white/10 transition-all"
              />
            </div>

            {error && <p className="text-[#FB923C] text-xs text-center">{error}</p>}

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-[#2DD4BF] to-[#F59E0B] text-[#080C1C] font-bold rounded-2xl shadow-xl shadow-[#2DD4BF]/10 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Create Free Account →"}
            </motion.button>
          </form>

          <p className="text-center mt-8 text-sm text-white/30 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-[#2DD4BF] hover:underline underline-offset-4">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};