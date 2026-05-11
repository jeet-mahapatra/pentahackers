import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../../Context/UserContext";

axios.defaults.withCredentials = true;

const UserDashboard = () => {
  const { user } = useContext(UserContext);

  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    cancelled: 0,
    completed: 0,
    newRequests: 0,
    todayAppointments: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/dashboard");
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080C1C] text-[#2DD4BF] font-serif italic text-xl">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading your experience...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C1C] text-white font-sans relative overflow-hidden pb-12">
      {/* ── BACKGROUND AURORA (Matches Landing) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[600px] h-[600px] top-[-10%] left-[-10%] rounded-full bg-[#2DD4BF]/5 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[500px] h-[500px] bottom-[-5%] right-[-5%] rounded-full bg-[#F59E0B]/5 blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 space-y-10">

        {/* ── GREETING HEADER ── */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <span className="text-[#2DD4BF] text-xs font-bold tracking-[0.2em] uppercase">User Dashboard</span>
            <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mt-2 italic">
              Hello, <span className="not-italic" style={{
                background: "linear-gradient(135deg, #2DD4BF 0%, #F59E0B 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>{user?.username || "User"}</span>
            </h1>
            <p className="text-white/40 mt-2 font-medium">Here's what is happening with your service requests today.</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md hidden md:block">
            <span className="text-sm text-white/60">Current Status: <span className="text-[#2DD4BF] font-bold">Active</span></span>
          </div>
        </motion.header>

        {/* ── STATS GRID ── */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Bookings" value={stats.total} accent="#2DD4BF" delay={0.1} />
          <StatCard title="Accepted" value={stats.accepted} accent="#34D399" delay={0.2} />
          <StatCard title="New Requests" value={stats.newRequests} accent="#0EA5E9" delay={0.3} />
          <StatCard title="Completed" value={stats.completed} accent="#F59E0B" delay={0.4} />
          <StatCard title="Cancelled" value={stats.cancelled} accent="#FB923C" delay={0.5} />
        </section>

        {/* ── TODAY'S APPOINTMENTS ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
        >
          <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-2xl font-bold font-serif italic">Today's Appointments</h3>
            <div className="w-10 h-10 bg-[#2DD4BF]/10 rounded-xl flex items-center justify-center text-[#2DD4BF]">◈</div>
          </div>

          <div className="p-6 md:p-8">
            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {stats.todayAppointments?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/20 text-lg font-medium italic">No scheduled tasks for today.</p>
                </div>
              ) : (
                stats.todayAppointments.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="group relative bg-white/5 border border-white/5 p-6 rounded-2xl hover:bg-white/10 hover:border-[#2DD4BF]/30 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold group-hover:text-[#2DD4BF] transition-colors">
                          {item.requestType}
                        </h4>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/40">
                          <span className="flex items-center gap-2">
                            <span className="text-[#F59E0B]">👤</span> Provider: {item.serviceProvider?.name || "N/A"}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="text-[#2DD4BF]">⏰</span> {item.appointmentTime || "Not set"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.section>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

// ── COMPONENT: STAT CARD ──
const StatCard = ({ title, value, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-xl text-center group transition-all"
  >
    <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2 group-hover:text-white/50 transition-colors">
      {title}
    </p>
    <h2
      className="text-3xl font-black font-serif italic transition-all"
      style={{ color: accent }}
    >
      {value}
    </h2>
    <div
      className="h-1 w-8 mx-auto mt-3 rounded-full opacity-30 group-hover:w-12 transition-all duration-300"
      style={{ backgroundColor: accent }}
    />
  </motion.div>
);

// ── COMPONENT: STATUS BADGE ──
const StatusBadge = ({ status }) => {
  const styles = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-full border ${styles[status] || styles.pending}`}>
      {status === 'pending' ? 'Accepted' : status}
    </span>
  );
};

export { UserDashboard };