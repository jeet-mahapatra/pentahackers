import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

axios.defaults.withCredentials = true;

const ProviderLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({ newAppointments: 0, urgentRequests: 0 });

  const isSuspended = user?.verificationStatus === "suspended";

  const fetchCounts = async () => {
    try {
      const [newRes, urgentRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND}/api/appointments/new`),
        axios.get(`${import.meta.env.VITE_BACKEND}/api/appointments/urgent`),
      ]);
      setCounts({
        newAppointments: newRes.data?.total || 0,
        urgentRequests: urgentRes.data?.appointments?.length || 0,
      });
    } catch (err) {
      console.log("Notification error:", err.message);
    }
  };

  useEffect(() => {
    if (user && !isSuspended) fetchCounts();
  }, [user, isSuspended]);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isProvider = useMemo(
    () => ["approved_provider", "pending_provider"].includes(user?.role),
    [user?.role]
  );

  const getStatusColor = () => {
    if (isSuspended) return "text-red-400";
    if (user.role === "approved_provider") return "text-[#34D399]";
    if (user.role === "pending_provider") return "text-[#F59E0B]";
    return "text-white/40";
  };

  const getStatusDotColor = () => {
    if (isSuspended) return "bg-red-500";
    if (user.role === "approved_provider") return "bg-[#34D399]";
    return "bg-[#F59E0B]";
  };

  const getStatusLabel = () => {
    if (isSuspended) return "Suspended";
    if (user.role === "approved_provider") return "Active Provider";
    return "Pending";
  };

  const navClass = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-[14px] font-semibold tracking-wide ${isActive
      ? "bg-gradient-to-r from-[#2DD4BF]/15 to-[#0EA5E9]/15 text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-[0_4px_20px_rgba(45,212,191,0.15)]"
      : "text-white/50 hover:bg-white/[0.04] hover:text-white border border-transparent"
    }`;

  const disabledNavClass =
    "flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-semibold tracking-wide text-white/20 cursor-not-allowed border border-transparent select-none";

  if (!user) {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen"
        style={{ background: "#080C1C", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="w-8 h-8 border-2 border-[#2DD4BF] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#2DD4BF] text-sm tracking-widest uppercase font-semibold">Loading Dashboard...</p>
      </div>
    );
  }

  const mainNavLinks = [
    { to: "/provider/dashboard", icon: "🏠", label: "Dashboard" },
    {
      to: "/provider/appointments",
      icon: "📅",
      label: "Appointments",
      badge: counts.newAppointments > 0 ? counts.newAppointments : null,
      badgeClass: "bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30",
    },
    {
      to: "/provider/urgent",
      icon: "⚡",
      label: "Urgent Requests",
      badge: counts.urgentRequests > 0 ? counts.urgentRequests : null,
      badgeClass: "bg-[#FB923C]/20 text-[#FB923C] border border-[#FB923C]/30 animate-pulse",
    },
    { to: "/provider/chats", icon: "💬", label: "Chats" },
    { to: "/provider/services", icon: "🛠", label: "Services" },
    { to: "/provider/profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: "#080C1C",
        color: "#fff",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* ── MOBILE OVERLAY
          z-[998]: dims the page behind the open sidebar on mobile.
          Hidden on md+. Below the ConciergeModal portal (z-[9999]).
      ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#080C1C]/80 backdrop-blur-sm z-[998] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR
          z-[999]: slides above the mobile overlay backdrop.
          On md+ it's statically positioned — no stacking context conflict.
          ConciergeModal portal (z-[9999]) always wins.
      ── */}
      <div
        className={`fixed md:static z-[999] h-full w-64 bg-[#080C1C]/90 backdrop-blur-2xl border-r border-white/[0.05] flex flex-col justify-between p-5 transition-transform duration-300 shadow-[20px_0_40px_rgba(0,0,0,0.5)]
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div>
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] w-10 h-10 flex items-center justify-center rounded-xl font-black text-lg shadow-[0_4px_15px_rgba(45,212,191,0.3)]">
              ✦
            </div>
            <div>
              <h2 className="font-extrabold text-xl tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                Service<span className="text-[#2DD4BF]">Hub</span>
              </h2>
              <p className="text-[11px] uppercase tracking-wider text-white/40 font-bold mt-0.5">
                Provider Panel
              </p>
            </div>
          </div>

          {/* SUSPENDED BANNER */}
          {isSuspended && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-xl border border-red-500/30 bg-red-950/20 px-3 py-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-400 text-xs">⚠</span>
                <p className="text-[11px] font-black text-red-400 uppercase tracking-widest">Account Suspended</p>
              </div>
              <p className="text-[10px] text-red-400/60 leading-relaxed">
                Access is restricted. Contact support to resolve this issue.
              </p>
            </motion.div>
          )}

          {isProvider && (
            <>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-4 px-2">Quick Actions</p>
              <ul className="space-y-2">
                {mainNavLinks.map(({ to, icon, label, badge, badgeClass }) => (
                  <li key={to}>
                    {isSuspended ? (
                      <div className={disabledNavClass} title="Account suspended">
                        <span className="flex items-center gap-3 opacity-40">
                          {icon} {label}
                        </span>
                        <span className="text-[10px] text-red-400/50 font-bold">LOCKED</span>
                      </div>
                    ) : (
                      <NavLink to={to} className={navClass} onClick={() => setSidebarOpen(false)}>
                        <span className="flex items-center gap-3">{icon} {label}</span>
                        {badge && (
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                            {badge}
                          </span>
                        )}
                      </NavLink>
                    )}
                  </li>
                ))}

                {/* Support — always available */}
                <li>
                  <NavLink
                    to="/provider/support"
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-[14px] font-semibold tracking-wide border ${isActive
                        ? "bg-gradient-to-r from-[#2DD4BF]/15 to-[#0EA5E9]/15 text-[#2DD4BF] border-[#2DD4BF]/30 shadow-[0_4px_20px_rgba(45,212,191,0.15)]"
                        : isSuspended
                          ? "text-[#2DD4BF]/80 bg-[#2DD4BF]/5 border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/10"
                          : "text-white/50 hover:bg-white/[0.04] hover:text-white border-transparent"
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="flex items-center gap-3">👥 Support</span>
                    {isSuspended && (
                      <span className="text-[10px] text-[#2DD4BF] font-black bg-[#2DD4BF]/10 px-2 py-0.5 rounded-full border border-[#2DD4BF]/20">
                        AVAILABLE
                      </span>
                    )}
                  </NavLink>
                </li>
              </ul>
            </>
          )}
        </div>

        {/* LOGOUT */}
        <div className="pt-4 border-t border-white/[0.05]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-left text-white/50 font-semibold px-4 py-3 rounded-xl hover:bg-[#FB923C]/10 hover:text-[#FB923C] transition-all duration-300"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(45,212,191,0.05)_0%,transparent_70%)] rounded-full blur-[80px] pointer-events-none" />

        {/* TOPBAR */}
        <div className="flex justify-between items-center bg-[#080C1C]/60 backdrop-blur-2xl border-b border-white/[0.05] px-4 md:px-8 py-4 z-10">
          <button
            className="md:hidden text-white/80 hover:text-white text-2xl leading-none transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div className="flex items-center gap-4 md:gap-6 ml-auto">
            {/* STATUS */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getStatusDotColor()}`} />
              <span className={`font-bold text-[12px] uppercase tracking-wider ${getStatusColor()}`}>
                {getStatusLabel()}
              </span>
            </div>

            <div className="h-5 w-px bg-white/[0.1] hidden sm:block" />

            {/* USER AVATAR */}
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full p-[2px] ${isSuspended ? "bg-gradient-to-tr from-red-500 to-red-700" : "bg-gradient-to-tr from-[#2DD4BF] to-[#0EA5E9]"}`}>
                <div className="w-full h-full bg-[#080C1C] rounded-full flex items-center justify-center text-[12px] font-bold">
                  {(user?.username || "P").charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="font-semibold text-white/90 text-[14px] hidden sm:inline">
                {user?.username || "Provider"}
              </span>
            </div>
          </div>
        </div>

        {/* SUSPENDED WALL for non-support routes */}
        {isSuspended && !location.pathname.startsWith("/provider/support") ? (
          <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-500/5 blur-[100px] rounded-full" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md w-full text-center bg-white/[0.03] border border-red-500/20 rounded-3xl p-8 md:p-10 backdrop-blur-2xl shadow-2xl"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-4xl">
                🔒
              </div>
              <h2 className="text-2xl font-black font-serif italic text-red-400 mb-3">Account Suspended</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Your provider account has been suspended by an administrator. All features are temporarily locked.
                Please contact support to appeal or resolve this issue.
              </p>
              <NavLink
                to="/provider/support"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-transform active:scale-95 hover:scale-105"
              >
                👥 Go to Support
              </NavLink>
            </motion.div>
          </div>
        ) : (
          /* MAIN CONTENT */
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth z-10 relative">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
};

export { ProviderLayout };