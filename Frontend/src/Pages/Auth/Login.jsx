
// import { motion } from "framer-motion";
// import { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { UserContext } from "../../Context/UserContext";

// axios.defaults.baseURL = "http://localhost:3000";
// axios.defaults.withCredentials = true;

// const Login = () => {
//   const navigate = useNavigate();
//   const { setUser } = useContext(UserContext);

//   const [formData, setFormData] = useState({
//     loginIdentifier: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     setLoading(true);
//     setError("");

//     try {
//       const res = await axios.post("/api/auth/login", {
//         loginIdentifier: formData.loginIdentifier,
//         password: formData.password,
//       });

//       const user = res.data.user;

//       console.log("LOGIN USER:", user);

//       // update context
//       setUser(user);

//       // ONLY TWO ROLES NOW
//       if (user.type === "provider") {
//         navigate("/provider/dashboard");
//       } else {
//         navigate("/user/dashboard");
//       }

//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

//       <motion.div
//         initial={{ opacity: 0, y: 80, scale: 0.9 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.6 }}
//         className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-96 text-white"
//       >
//         <h2 className="text-3xl font-bold text-center mb-6">
//           Welcome Back 👋
//         </h2>

//         <form onSubmit={handleSubmit}>

//           <input
//             type="text"
//             name="loginIdentifier"
//             value={formData.loginIdentifier}
//             onChange={handleChange}
//             placeholder="Email or Username"
//             required
//             className="w-full p-3 mb-4 bg-transparent border border-white/30 rounded-lg outline-none focus:border-white text-white"
//           />

//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Password"
//             required
//             className="w-full p-3 mb-4 bg-transparent border border-white/30 rounded-lg outline-none focus:border-white text-white"
//           />

//           {error && (
//             <p className="text-red-300 text-sm mb-3 text-center">
//               {error}
//             </p>
//           )}

//           <motion.button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-white text-purple-700 font-semibold py-3 rounded-lg"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </motion.button>

//         </form>

//         <p className="text-center text-sm mt-5 text-white/70">
//           Don't have an account?{" "}
//           <Link to="/register" className="underline hover:text-white">
//             Register
//           </Link>
//         </p>

//       </motion.div>
//     </div>
//   );
// };

// export { Login };











import { motion } from "framer-motion";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    loginIdentifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/login", {
        loginIdentifier: formData.loginIdentifier,
        password: formData.password,
      });

      const user = res.data.user;

      console.log("LOGIN USER:", user);

      // save user in context
      setUser(user);

      // ================= ROLE BASED NAVIGATION =================
      if (user.role === "user") {
        navigate("/user/dashboard");
      } else {
        navigate("/provider/dashboard");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-96 text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="loginIdentifier"
            value={formData.loginIdentifier}
            onChange={handleChange}
            placeholder="Email or Username"
            required
            className="w-full p-3 mb-4 bg-transparent border border-white/30 rounded-lg outline-none focus:border-white text-white"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-3 mb-4 bg-transparent border border-white/30 rounded-lg outline-none focus:border-white text-white"
          />

          {error && (
            <p className="text-red-300 text-sm mb-3 text-center">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-purple-700 font-semibold py-3 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

        </form>

        <p className="text-center text-sm mt-5 text-white/70">
          Don't have an account?{" "}
          <Link to="/register" className="underline hover:text-white">
            Register
          </Link>
        </p>

      </motion.div>
    </div>
  );
};

export { Login };