
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

axios.defaults.withCredentials = true;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/appointments/new",
        { withCredentials: true }
      );
      setAppointments(res.data.appointments);
    } catch (err) {
      console.log("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/appointments/accept/${id}`,
        {},
        { withCredentials: true }
      );
      setAppointments((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log("Accept error:", err.response?.data || err.message);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/appointments/cancel/${id}`,
        {},
        { withCredentials: true }
      );
      setAppointments((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log("Cancel error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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
      <div className="relative p-6 rounded-[22px] m-4 overflow-hidden border border-white/[0.07] bg-white/[0.025] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Subtle background glow matching the aurora mesh */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#2DD4BF]/10 to-[#0EA5E9]/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <h2 
            className="text-3xl font-black tracking-tight mb-1"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            New Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-[#F59E0B] italic">Requests</span>
          </h2>
          <p className="text-[14px] text-white/40">
            Manage incoming appointments efficiently
          </p>
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-[#2DD4BF] border-t-transparent rounded-full mb-4"
            />
            <p className="text-white/40 text-sm tracking-widest uppercase font-semibold">Loading requests...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center mt-20 p-8 rounded-[22px] border border-white/[0.05] bg-white/[0.015] max-w-md mx-auto">
            <div className="text-4xl mb-4 opacity-50">✨</div>
            <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Fraunces', serif" }}>You're all caught up!</h3>
            <p className="text-white/40 text-sm">No new appointments at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {appointments.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group p-6 rounded-[22px] bg-white/[0.025] border border-white/[0.07] hover:border-[#2DD4BF]/30 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300"
                  style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-[22px] bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.08),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* USER INFO */}
                  <div className="mb-5 border-b border-white/[0.05] pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[19px] font-bold text-white tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                        {item.requestType}
                      </h3>
                      <span className="bg-[#2DD4BF]/10 text-[#2DD4BF] text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full border border-[#2DD4BF]/20">
                        New
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[13px] text-white/50 mb-1">
                      <span className="text-[#F59E0B]">👤</span> {item.serviceUser?.username}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-white/50">
                      <span className="text-[#34D399]">📧</span> {item.serviceUser?.email}
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="text-[13px] space-y-2.5 text-white/60 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-white/40">Date</span>
                      <span className="text-white font-medium">
                        {item.appointmentDate ? new Date(item.appointmentDate).toLocaleDateString() : "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/40">Time</span>
                      <span className="text-white font-medium">{item.appointmentTime || "Not specified"}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/40">Urgency</span>
                      <span className={item.isUrgent ? "text-[#FB923C] font-semibold flex items-center gap-1" : "text-[#34D399] font-medium"}>
                        {item.isUrgent && <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] animate-pulse"></span>}
                        {item.isUrgent ? "Urgent" : "Standard"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/40">Status</span>
                      <span className="text-[#F59E0B] font-medium capitalize">
                        {item.status}
                      </span>
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
                      className="flex-1 bg-white/5 border border-white/10 text-white/80 text-[14px] font-semibold py-2.5 rounded-xl hover:bg-white/10 hover:text-white hover:-translate-y-0.5 hover:border-white/20 backdrop-blur-md transition-all duration-200"
                    >
                      Cancel
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

export { Appointments };