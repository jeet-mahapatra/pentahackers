import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

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
      const res = await axios.post("http://localhost:3000/api/auth/admin-login", {
        email,
        password,
      });

      const user = res.data.user;
      setUser(user);

      // Redirect directly to the admin dashboard
      navigate("/admin/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-96 border border-red-500/20">
        <h2 className="text-2xl font-bold mb-6 text-center tracking-widest text-red-500">ADMIN LOGIN</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            required
            className="w-full mb-4 p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-red-500"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full mb-4 p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-red-500"
          />

          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 transition-colors p-3 rounded font-bold uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export { AdminLogin };