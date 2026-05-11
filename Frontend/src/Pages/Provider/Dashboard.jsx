
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { motion } from "framer-motion";

axios.defaults.withCredentials = true;

const StatCard = ({ title, value, accent = "#2DD4BF", icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3, borderColor: "rgba(45,212,191,0.25)" }}
    transition={{ duration: 0.4 }}
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
      padding: "18px 16px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.3s, transform 0.3s",
    }}
  >
    <div style={{
      position: "absolute", inset: 0,
      background: `radial-gradient(circle at 50% 0%, ${accent}10, transparent 70%)`,
      pointerEvents: "none",
    }} />
    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
    <h2 style={{
      fontFamily: "'Fraunces', serif",
      fontSize: "clamp(22px, 2.5vw, 28px)",
      fontWeight: 900,
      background: `linear-gradient(135deg, ${accent}, #fff)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      margin: "0 0 4px",
      letterSpacing: "-0.5px",
    }}>{value}</h2>
    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {title}
    </p>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const [stats, setStats] = useState({
    totalRequests: 0,
    totalNew: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/appointments/stats", { withCredentials: true });
      setStats(res.data);
    } catch (err) {
      console.log("Stats error:", err.response?.data || err.message);
    }
  };

  const fetchPending = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/appointments/pending", { withCredentials: true });
      const sorted = (res.data.appointments || []).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
      setPendingAppointments(sorted);
    } catch (err) {
      console.log("Pending error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/appointments/complete/${id}`, {}, { withCredentials: true });
      setPendingAppointments((prev) => prev.filter((item) => item._id !== id));
      fetchStats();
    } catch (err) {
      console.log("Complete error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPending();
  }, []);

  const statItems = [
    { title: "Total", value: stats.totalRequests, accent: "#2DD4BF", icon: "◈" },
    { title: "New", value: stats.totalNew, accent: "#0EA5E9", icon: "✦" },
    { title: "Pending", value: stats.pending, accent: "#F59E0B", icon: "◎" },
    { title: "Completed", value: stats.completed, accent: "#34D399", icon: "⬡" },
    { title: "Cancelled", value: stats.cancelled, accent: "#FB923C", icon: "⊘" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080C1C",
      color: "#fff",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: 24,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&display=swap');

        .shimmer-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(45,212,191,0.5), rgba(245,158,11,0.5), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .btn-complete {
          padding: 8px 18px;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.25);
          border-radius: 10px;
          color: #34D399;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .btn-complete:hover {
          background: rgba(52,211,153,0.2);
          border-color: rgba(52,211,153,0.45);
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(52,211,153,0.2);
        }

        .pending-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 18px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          transition: all 0.3s;
        }
        .pending-item:hover {
          border-color: rgba(45,212,191,0.18);
          background: rgba(255,255,255,0.04);
        }

        @media (max-width: 640px) {
          .pending-item { flex-direction: column; align-items: flex-start; }
          .pending-item .btn-complete { width: 100%; text-align: center; }
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "rgba(8,12,28,0.9)",
          border: "1px solid rgba(45,212,191,0.18)",
          borderRadius: 22,
          padding: "28px 32px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div className="shimmer-line" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 280, height: 200, background: "radial-gradient(circle at top right, rgba(45,212,191,0.12), transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 200, height: 150, background: "radial-gradient(circle at bottom left, rgba(245,158,11,0.1), transparent 60%)", pointerEvents: "none" }} />

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                width: 42, height: 42, borderRadius: 12,
                background: "linear-gradient(135deg, #2DD4BF, #F59E0B)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, color: "#080C1C", fontWeight: 800,
                flexShrink: 0,
              }}
            >✦</motion.div>
            <div>
              <h2 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(18px, 2.5vw, 26px)",
                fontWeight: 900,
                letterSpacing: "-0.5px",
                margin: 0,
              }}>
                Welcome back,{" "}
                <span style={{
                  background: "linear-gradient(135deg, #2DD4BF, #F59E0B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>{user?.username || "Provider"}</span>
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "3px 0 0" }}>
                Here's your appointment overview
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="stats-grid"
      >
        {statItems.map((s, i) => (
          <motion.div key={i} transition={{ delay: 0.15 + i * 0.07 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </motion.div>

      {/* Pending Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 22,
          padding: "24px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: "#F59E0B",
            boxShadow: "0 0 8px rgba(245,158,11,0.6)",
          }} />
          <h3 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(16px, 2vw, 20px)",
            fontWeight: 800,
            letterSpacing: "-0.3px",
            margin: 0,
            color: "#F59E0B",
          }}>Pending Appointments</h3>
          {!loading && (
            <span style={{
              marginLeft: "auto",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
              borderRadius: 8, padding: "3px 10px",
              fontSize: 12, fontWeight: 600, color: "#F59E0B",
            }}>{pendingAppointments.length}</span>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 32, height: 32,
                  border: "2px solid rgba(255,255,255,0.08)",
                  borderTop: "2px solid #2DD4BF",
                  borderRadius: "50%",
                }}
              />
            </div>
          ) : pendingAppointments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>◎</div>
              <p style={{ fontSize: 14 }}>No pending appointments</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pendingAppointments.map((item, i) => (
                <motion.div
                  key={item._id}
                  className="pending-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: "linear-gradient(135deg, rgba(45,212,191,0.15), rgba(14,165,233,0.15))",
                      border: "1px solid rgba(45,212,191,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700, color: "#2DD4BF",
                      flexShrink: 0,
                    }}>
                      {item.serviceUser?.username?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, margin: 0, truncate: true, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.requestType}
                      </p>
                      <div style={{ display: "flex", gap: 12, marginTop: 3, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>👤 {item.serviceUser?.username}</span>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>📅 {new Date(item.appointmentDate).toLocaleDateString()}</span>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>⏰ {item.appointmentTime || "Not set"}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      background: "rgba(245,158,11,0.1)",
                      border: "1px solid rgba(245,158,11,0.25)",
                      borderRadius: 6, padding: "3px 8px",
                      color: "#F59E0B",
                    }}>{item.status}</span>
                    <button className="btn-complete" onClick={() => handleComplete(item._id)}>
                      ✓ Complete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export { Dashboard };