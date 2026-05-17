
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

axios.defaults.withCredentials = true;

const UrgentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUrgent = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND}/api/appointments/urgent`,
        { withCredentials: true }
      );
      setRequests(res.data.appointments || []);
    } catch (err) {
      console.log("Urgent error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrgent();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND}/api/appointments/accept/${id}`,
        {},
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log("Accept error:", err.response?.data || err.message);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND}/api/appointments/cancel/${id}`,
        {},
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log("Cancel error:", err.response?.data || err.message);
    }
  };

  return (
    <div 
      className="h-full flex flex-col font-sans"
      style={{ 
        background: "#080C1C", 
        color: "#fff",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" 
      }}
    >
      {/* HEADER */}
      <div className="relative p-6 rounded-[22px] m-4 overflow-hidden border border-[#FB923C]/20 bg-[#FB923C]/[0.03] shadow-[0_8px_32px_rgba(251,146,60,0.15)]">
        {/* Urgent pulsating ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C]/10 to-red-500/5 blur-2xl pointer-events-none animate-pulse" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FB923C] to-red-500 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(251,146,60,0.4)]">
            🚨
          </div>
          <div>
            <h2 
              className="text-3xl font-black tracking-tight mb-1"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Urgent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FB923C] to-red-400 italic">Requests</span>
            </h2>
            <p className="text-[14px] text-[#FB923C]/70 font-medium tracking-wide">
              Priority services requiring immediate attention
            </p>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-[#FB923C] border-t-transparent rounded-full mb-4"
            />
            <p className="text-[#FB923C]/70 text-sm tracking-widest uppercase font-semibold">Loading priorities...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center mt-20 p-8 rounded-[22px] border border-white/[0.05] bg-white/[0.015] max-w-md mx-auto">
            <div className="text-5xl mb-4 opacity-80">☕</div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              All Clear
            </h3>
            <p className="text-white/40 text-sm">
              No urgent requests at the moment. Take a breather!
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {requests.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group p-6 rounded-[22px] bg-white/[0.025] border border-[#FB923C]/30 hover:border-[#FB923C]/60 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-[22px] bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* USER INFO & BADGE */}
                  <div className="mb-5 border-b border-white/[0.05] pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-[19px] font-bold text-white tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                        {item.requestType}
                      </h3>
                      <span className="flex items-center gap-1.5 bg-[#FB923C]/10 text-[#FB923C] text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full border border-[#FB923C]/20 shadow-[0_0_10px_rgba(251,146,60,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] animate-pulse"></span>
                        Urgent
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[13px] text-white/50 mb-1.5">
                      <span className="text-[#F59E0B] text-sm">👤</span> 
                      <span className="font-medium text-white/80">{item.serviceUser?.username}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-white/50">
                      <span className="text-[#34D399] text-sm">📧</span> 
                      {item.serviceUser?.email}
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="text-[13px] space-y-3 text-white/60 mb-6">
                    <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded-lg border border-white/[0.03]">
                      <span className="text-white/40 flex items-center gap-2">📅 Date</span>
                      <span className="text-white font-medium">
                        {item.appointmentDate ? new Date(item.appointmentDate).toLocaleDateString() : "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded-lg border border-white/[0.03]">
                      <span className="text-white/40 flex items-center gap-2">⏰ Time</span>
                      <span className="text-white font-medium">{item.appointmentTime || "ASAP"}</span>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-3 mt-auto relative z-10">
                    <button
                      onClick={() => handleAccept(item._id)}
                      className="flex-1 bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] text-[14px] font-bold py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(45,212,191,0.3)] transition-all duration-200"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleCancel(item._id)}
                      className="flex-1 bg-white/[0.03] border border-white/[0.08] text-white/70 text-[14px] font-semibold py-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-400 hover:-translate-y-0.5 hover:border-red-500/30 backdrop-blur-md transition-all duration-200"
                    >
                      Decline
                    </button>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export { UrgentRequests };