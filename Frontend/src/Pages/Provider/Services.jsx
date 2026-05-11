
import { useContext, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const MyServices = () => {
  const { user, setUser } = useContext(UserContext);
  const [newSlot, setNewSlot] = useState("");
  const [loading, setLoading] = useState(false);

  const addSlot = async () => {
    if (!newSlot.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/myservice/slots/add",
        { slot: newSlot }
      );

      setUser((prev) => ({
        ...prev,
        timeSlots: res.data.data.timeSlots,
      }));

      setNewSlot("");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding slot");
    } finally {
      setLoading(false);
    }
  };

  const removeSlot = async (slot) => {
    try {
      const res = await axios.delete(
        "http://localhost:3000/api/myservice/slots/remove",
        { data: { slot } }
      );

      setUser((prev) => ({
        ...prev,
        timeSlots: res.data.data.timeSlots,
      }));
    } catch {
      alert("Error removing slot");
    }
  };

  return (
    <div 
      className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 h-full font-sans"
      style={{ 
        background: "#080C1C", 
        color: "#fff",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" 
      }}
    >
      {/* LEFT PANEL - Profile & Verification */}
      <div className="w-full lg:w-1/3 rounded-[24px] border border-white/[0.07] bg-white/[0.02] shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col min-h-[380px] p-7 backdrop-blur-md">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-[radial-gradient(circle,rgba(245,158,11,0.1)_0%,transparent_60%)] pointer-events-none blur-xl" />

        <h2 
          className="text-2xl font-black mb-6 tracking-tight text-white relative z-10"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          My Profile
        </h2>

        <div className="mb-6 relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1">Service Category</p>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-[#F59E0B] inline-block">
            {user.serviceType || "Not Set"}
          </h3>
        </div>

        <div className="mb-8 relative z-10">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold border ${
            user.role === "approved_provider" 
              ? "bg-[#34D399]/10 border-[#34D399]/20 text-[#34D399]" 
              : "bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${user.role === "approved_provider" ? "bg-[#34D399]" : "bg-[#F59E0B] animate-pulse"}`} />
            {user.role === "approved_provider" ? "Verified Provider" : "Pending Verification"}
          </span>
        </div>

        <div className="mt-auto space-y-4 relative z-10 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/40 font-medium">Name</span>
            <span className="text-white/90 font-semibold">{user.username}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/40 font-medium">Email</span>
            <span className="text-white/90 font-semibold">{user.email}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/40 font-medium">Address</span>
            <span className="text-white/90 font-semibold text-right max-w-[150px] truncate" title={user.address}>
              {user.address || "Not provided"}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Available Slots */}
      <div className="flex-1 rounded-[24px] border border-white/[0.07] bg-white/[0.02] shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col min-h-[380px] p-7 backdrop-blur-md">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-60 h-60 bg-[radial-gradient(circle,rgba(45,212,191,0.08)_0%,transparent_60%)] pointer-events-none blur-xl" />

        <h2 
          className="text-2xl font-black mb-6 tracking-tight text-white relative z-10"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Available <span className="italic text-[#0EA5E9]">Slots</span>
        </h2>

        {/* SLOT LIST */}
        <div className="flex-1 overflow-y-auto pr-3 space-y-3 mb-6 custom-scrollbar relative z-10">
          <AnimatePresence>
            {user.timeSlots?.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-white/30 text-sm">
                <span className="text-3xl mb-2 opacity-50">⏰</span>
                <p>No slots added yet.</p>
              </div>
            ) : (
              user.timeSlots?.map((slot) => (
                <motion.div
                  key={slot}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                  transition={{ duration: 0.2 }}
                  className="group flex justify-between items-center bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-[#0EA5E9]/30 p-3.5 rounded-[14px] transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-[#2DD4BF] text-sm">
                      🕒
                    </div>
                    <span className="text-white/80 font-medium tracking-wide">{slot}</span>
                  </div>

                  <button
                    onClick={() => removeSlot(slot)}
                    className="text-white/30 hover:text-[#FB923C] text-[13px] font-bold tracking-wider uppercase transition-colors px-2 py-1"
                  >
                    Remove
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* ADD SLOT */}
        <div className="flex gap-3 mt-auto pt-6 border-t border-white/[0.05] relative z-10">
          <input
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            placeholder="e.g. 10:00 AM - 11:30 AM"
            className="flex-1 bg-white/[0.03] border border-white/[0.1] text-white placeholder-white/30 p-3.5 rounded-xl outline-none focus:border-[#2DD4BF]/50 focus:bg-white/[0.06] transition-all duration-300 font-medium"
          />

          <button
            onClick={addSlot}
            disabled={loading}
            className="bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] px-6 py-3 rounded-xl font-bold tracking-wide shadow-[0_8px_20px_rgba(45,212,191,0.25)] hover:shadow-[0_12px_25px_rgba(45,212,191,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#080C1C] border-t-transparent rounded-full animate-spin" />
              </span>
            ) : (
              "Add Slot"
            )}
          </button>
        </div>
      </div>

      {/* Optional: Add custom scrollbar styling globally or in your CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export { MyServices };