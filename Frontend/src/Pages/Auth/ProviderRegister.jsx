import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

export const ProviderRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "provider",
    serviceType: "",
    address: "",
  });

  const [files, setFiles] = useState({
    idProof: null,
    photoproof: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", "provider");
      data.append("serviceType", formData.serviceType);
      data.append("address", formData.address);

      data.append("idProof", files.idProof);
      data.append("photoproof", files.photoproof);

      await axios.post("http://localhost:3000/api/auth/register/provider", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  const services = [
    "Electrician",
    "Plumber",
    "Carpenter",
    "Mechanic",
    "Painter",
    "Tutor",
    "Cleaner",
    "Driver",
    "Cook",
    "Beautician",
    "Fitness Trainer",
    "AC Technician",
    "Photographer",
    "Event Planner",
    "Computer Technician",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/30 blur-[160px] rounded-full top-[-120px] left-[-120px]" />
      <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-[160px] rounded-full bottom-[-120px] right-[-120px]" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-[430px] p-8 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Provider Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/20 outline-none focus:border-indigo-400"
          />

          {/* EMAIL */}
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/20 outline-none focus:border-cyan-400"
          />

          {/* PASSWORD */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/20 outline-none focus:border-purple-400"
          />

          {/* SERVICE TYPE (FIXED SELECT UI) */}
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white outline-none focus:border-indigo-400"
          >
            <option value="" className="bg-[#0b1025] text-gray-300">
              Select Service Type
            </option>

            {services.map((service, i) => (
              <option
                key={i}
                value={service}
                className="bg-[#0b1025] text-white"
              >
                {service}
              </option>
            ))}
          </select>

          {/* ADDRESS */}
          <input
            name="address"
            placeholder="Full Address"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/20 outline-none focus:border-pink-400"
          />

          {/* ID PROOF */}
          <label className="text-sm text-indigo-300">Upload ID Proof</label>
          <label className="block border-2 border-dashed border-indigo-400/40 rounded-xl p-4 text-center cursor-pointer hover:bg-indigo-500/10">
            <input type="file" name="idProof" onChange={handleFileChange} className="hidden" />
            <p className="text-sm text-gray-300">
              {files.idProof ? files.idProof.name : "Click to upload ID proof"}
            </p>
          </label>

          {/* PHOTO PROOF */}
          <label className="text-sm text-purple-300">Upload Photo Proof</label>
          <label className="block border-2 border-dashed border-purple-400/40 rounded-xl p-4 text-center cursor-pointer hover:bg-purple-500/10">
            <input type="file" name="photoproof" onChange={handleFileChange} className="hidden" />
            <p className="text-sm text-gray-300">
              {files.photoproof ? files.photoproof.name : "Click to upload photo proof"}
            </p>
          </label>

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* BUTTON */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 shadow-lg"
          >
            {loading ? "Registering..." : "Create Provider Account"}
          </motion.button>

        </form>

        {/* LOGIN LINK */}
        <p className="text-center mt-4 text-sm text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};