import { motion } from "framer-motion";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [activeRole, setActiveRole] = useState("user"); // Unified system selector tracker
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
      // Pass both parameters cleanly into authentication pipeline structure
      const payload = { ...formData, role: activeRole };
      const res = await axios.post("/api/auth/login", payload);
      setUser(res.data.user);
      toast.success("Logged in successfully! Redirecting...");
      navigate(res.data.user.role === "user" ? "/user/dashboard" : "/provider/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      toast.error("Login failed - check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080C1C] text-white relative overflow-hidden px-4 py-12">
      <Link to="/" className="absolute top-6 left-6 md:top-11 md:left-11 text-[#2DD4BF] font-bold text-sm md:text-lg z-10 transition-colors hover:text-[#2dd4bf]/80">
        ← Back to Home
      </Link>

      {/* Background Aurora Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[300px] sm:w-[700px] h-[300px] sm:h-[700px] top-[10%] right-[-10%] rounded-full bg-[#F59E0B]/10 blur-[80px] sm:blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[250px] sm:w-[600px] h-[250px] sm:h-[600px] bottom-[-10%] left-[-10%] rounded-full bg-[#2DD4BF]/10 blur-[80px] sm:blur-[100px]"
        />
      </div>

      {/* Floating Badge Reference */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-20 right-10 hidden lg:flex bg-[#080C1C]/60 backdrop-blur-xl border border-[#2DD4BF]/30 p-4 rounded-2xl gap-3 shadow-2xl"
      >
        <div className="w-10 h-10 bg-[#2DD4BF] rounded-lg flex items-center justify-center text-black font-bold">✦</div>
        <div>
          <p className="text-sm font-bold">Secure Access</p>
          <p className="text-[10px] text-white/40">Verified by ServiceHub Auth</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black font-serif tracking-tighter mb-2 italic">Welcome Back</h2>
            <p className="text-white/40 text-sm font-medium">Unified Account Access Portal</p>
          </div>

          {/* Core Interactive Role Toggle Switcher */}
          <div className="grid grid-cols-2 p-1.5 bg-white/5 border border-white/5 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => setActiveRole("user")}
              className={`py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 ${activeRole === "user"
                  ? "bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
            >
              👤 Client Login
            </button>
            <button
              type="button"
              onClick={() => setActiveRole("provider")}
              className={`py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 ${activeRole === "provider"
                  ? "bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
            >
              🔧 Provider Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <input
                type="text"
                name="loginIdentifier"
                placeholder={activeRole === "user" ? "Email or Username" : "Provider Email / Phone"}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#2DD4BF]/50 focus:bg-white/10 transition-all placeholder:text-white/20 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#2DD4BF]/50 focus:bg-white/10 transition-all placeholder:text-white/20 text-sm"
                required
              />
            </div>

            {error && <p className="text-center text-[#FB923C] text-sm font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-[#080C1C] font-bold rounded-2xl hover:bg-[#2DD4BF] transition-colors shadow-xl disabled:opacity-50 text-sm cursor-pointer"
            >
              {loading ? "Verifying..." : `Sign In as ${activeRole === "user" ? "Client" : "Provider"} →`}
            </button>
          </form>

          {/* Explicit Multi-Choice Custom Registration Split Footer Segment */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs sm:text-sm text-white/30 font-medium mb-3">
              Don't have an account yet?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <Link to="/register/user" className="text-white hover:text-[#2DD4BF] transition-colors font-bold underline underline-offset-4 decoration-white/20 hover:decoration-[#2DD4BF]">
                Register as User
              </Link>
              <span className="text-white/10 hidden sm:inline">|</span>
              <Link to="/register/provider" className="text-[#F59E0B] hover:text-[#2DD4BF] transition-colors font-bold underline underline-offset-4 decoration-[#F59E0B]/20 hover:decoration-[#2DD4BF]">
                Join as Provider
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export { Login };