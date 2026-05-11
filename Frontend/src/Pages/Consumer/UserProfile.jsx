import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

const UserProfile = () => {
  const { user, setUser, loading: contextLoading } = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Optional details state
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    bio: "",
    address: "",
    state: "",
    country: "",
    pinCode: "",
    timezone: "",
  });

  // Sync basic data from Context and optional data from User Model
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        address: user.address || "",
        state: user.state || "",
        country: user.country || "",
        pinCode: user.pinCode || "",
        timezone: user.timezone || "",
      });
    }
  }, [user, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.put("/api/auth/profile/update", formData);
      if (res.data.success) {
        setUser(res.data.user); // Update global context with new data
        setMessage({ type: "success", text: "Optional details saved! ✦" });
        setIsEditing(false);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading) return (
    <div className="flex justify-center items-center h-screen bg-[#080C1C] text-[#2DD4BF] font-serif italic text-xl">
      Syncing Identity...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080C1C] p-6 md:p-10 text-white font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#2DD4BF]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 pb-20">

        {/* BASIC DETAILS HEADER (Fetched from Login) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] rounded-[3rem] p-8 md:p-12 text-[#080C1C] shadow-2xl mb-10 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-[#080C1C] text-white flex items-center justify-center text-4xl font-black">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left flex-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-[#080C1C] text-white px-3 py-1 rounded-full mb-3 inline-block">
                {user?.role}
              </span>
              <h1 className="text-4xl font-bold font-serif italic tracking-tighter capitalize leading-none">
                {user?.username}
              </h1>
              <p className="text-[#080C1C]/60 font-bold mt-1 italic">{user?.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-[#080C1C] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              {isEditing ? "Cancel" : "Add Details ◈"}
            </button>
          </div>
        </motion.div>

        {/* FEEDBACK */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className={`mb-8 p-4 rounded-2xl text-center font-black tracking-widest text-[10px] uppercase border ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-6">
          {/* OPTIONAL PERSONAL PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl"
          >
            <h2 className="text-lg font-bold font-serif italic mb-8 text-[#2DD4BF]">Personal Identity</h2>
            <div className="space-y-6">
              <InputField label="Full Legal Name" name="fullName" value={formData.fullName} onChange={handleChange} disabled={!isEditing} placeholder="Not added yet" />
              <InputField label="Mobile Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={!isEditing} placeholder="Not added yet" />
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-white/20 tracking-widest ml-1">About Me</label>
                <textarea
                  name="bio" value={formData.bio} onChange={handleChange} disabled={!isEditing}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#2DD4BF]/50 min-h-[120px] disabled:opacity-30 transition-all text-sm"
                  placeholder="Share a short bio..."
                />
              </div>
            </div>
          </motion.div>

          {/* OPTIONAL LOCATION PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl"
          >
            <h2 className="text-lg font-bold font-serif italic mb-8 text-[#F59E0B]">Location Details</h2>
            <div className="space-y-6">
              <InputField label="Address" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} placeholder="Street info" />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="State" name="state" value={formData.state} onChange={handleChange} disabled={!isEditing} placeholder="State" />
                <InputField label="Country" name="country" value={formData.country} onChange={handleChange} disabled={!isEditing} placeholder="Country" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Pin Code" name="pinCode" value={formData.pinCode} onChange={handleChange} disabled={!isEditing} placeholder="000000" />
                <InputField label="Timezone" name="timezone" value={formData.timezone} onChange={handleChange} disabled={!isEditing} placeholder="UTC+5:30" />
              </div>
            </div>
          </motion.div>

          {/* SAVE BUTTON */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
                className="md:col-span-2 flex justify-center pt-6"
              >
                <button
                  type="submit" disabled={loading}
                  className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] px-16 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  {loading ? "Updating..." : "Save Optional Details →"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, disabled, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase font-black text-white/20 tracking-widest ml-1">{label}</label>
    <input
      type="text" name={name} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#2DD4BF]/50 disabled:opacity-30 transition-all text-sm font-bold placeholder:text-white/5"
    />
  </div>
);

export { UserProfile };