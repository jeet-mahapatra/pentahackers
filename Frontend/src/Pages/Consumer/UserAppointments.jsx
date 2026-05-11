import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/appointment/list");
        if (res.data.success) {
          const sorted = res.data.data.sort((a, b) => new Date(b.appointmentDate || 0) - new Date(a.appointmentDate || 0));
          setAppointments(sorted);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080C1C] text-[#2DD4BF] italic font-serif text-xl">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          Syncing records...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C1C] text-white p-6 md:p-10 font-sans relative overflow-hidden">
      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2DD4BF]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
          <span className="text-[#2DD4BF] text-xs font-bold tracking-[0.3em] uppercase">Appointments</span>
          <h2 className="text-4xl md:text-5xl font-bold font-serif italic mt-2">All Activity</h2>
          <p className="text-white/40 mt-3 font-medium">History and upcoming schedules across all services.</p>
        </motion.div>

        <div className="space-y-6">
          {appointments.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-20 text-center">
              <p className="text-white/20 italic text-lg">No appointments found in your logs.</p>
            </motion.div>
          ) : (
            appointments.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/[0.05] transition-all duration-500 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl md:text-2xl font-bold group-hover:text-[#2DD4BF] transition-colors duration-300">
                        {item.requestType}
                      </h3>
                      {item.isUrgent && (
                        <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                          Urgent ◈
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/40">
                      <span className="flex items-center gap-2">
                        <span className="text-[#2DD4BF]">👤</span> {item.serviceProvider?.name || "N/A"}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-[#F59E0B]">📅</span> {item.appointmentDate ? new Date(item.appointmentDate).toLocaleDateString() : "Not set"}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-[#2DD4BF]">⏰</span> {item.appointmentTime || "Not set"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end md:min-w-[140px]">
                    <StatusBadge status={item.status} />
                    <motion.div className="ml-6 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-[#2DD4BF]/50 transition-all duration-500">
                      <span className="text-[#2DD4BF]">◈</span>
                    </motion.div>
                  </div>
                </div>

                {/* ANIMATED PROGRESS LINE */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] group-hover:w-full transition-all duration-1000" />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span className={`px-5 py-2 text-[10px] font-black uppercase tracking-tighter rounded-full border ${styles[status] || "bg-white/5 text-white/40 border-white/10"}`}>
      {status === 'pending' ? 'Accepted' : status}
    </span>
  );
};

export { AppointmentList };