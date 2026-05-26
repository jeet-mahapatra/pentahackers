import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

axios.defaults.withCredentials = true;

export const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isSuspended = user?.status === "suspended";

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

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-500 text-sm font-bold tracking-tight ${isActive
      ? "bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] shadow-[0_10px_20px_rgba(45,212,191,0.2)]"
      : "text-white/50 hover:text-white hover:bg-white/5"
    }`;

  const disabledNavClass =
    "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold tracking-tight text-white/20 cursor-not-allowed select-none";

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#080C1C] text-[#2DD4BF] font-serif italic text-xl">
        Loading Session...
      </div>
    );
  }

  const navLinks = [
    { to: "/user/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/user/findservices", icon: "🔍", label: "Find Services" },
    { to: "/user/bookings", icon: "📅", label: "Appointments" },
    { to: "/user/chats", icon: "💬", label: "Secure Chats" },
    { to: "/user/reviews", icon: "⭐", label: "My Reviews" },
    { to: "/user/profile", icon: "👤", label: "Profile Settings" },
  ];

  return (
    <div className="flex h-screen bg-[#080C1C] text-white font-sans overflow-hidden">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.05); 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* ── MOBILE OVERLAY
          z-[998]: sits above the sidebar (z-[999]) so it dims everything
          behind it, but below the ConciergeModal portal (z-[9999]).
          On md+ screens this is hidden entirely.
      ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR
          z-[999]: above the mobile overlay backdrop so it slides over it.
          On md+ it's statically positioned so z-index doesn't create a
          stacking context that could fight with anything.
          The ConciergeModal portal uses z-[9999] and lives on document.body,
          so it always wins regardless of this value.
      ── */}
      <aside
        className={`fixed md:static z-[999] h-full w-72 bg-[#0D1226]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col justify-between p-6 transition-all duration-500 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div>
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2DD4BF] to-[#F59E0B] rounded-xl flex items-center justify-center text-[#080C1C] font-black shadow-lg">
              ◈
            </div>
            <div>
              <h2 className="font-bold font-serif italic text-xl leading-none">
                Easy<span className="text-[#2DD4BF]">Find</span>
              </h2>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black mt-1">
                EasyFind Protocol
              </p>
            </div>
          </div>

          {/* SUSPENDED BANNER */}
          {isSuspended && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-2xl border border-red-500/30 bg-red-950/20 px-4 py-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-400 text-sm">⚠</span>
                <p className="text-xs font-black text-red-400 uppercase tracking-widest">Account Suspended</p>
              </div>
              <p className="text-[11px] text-red-400/60 leading-relaxed">
                Your account is suspended. Only the Support page is accessible. Contact support to resolve this.
              </p>
            </motion.div>
          )}

          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 px-2">
            Management
          </p>

          <nav className="space-y-2">
            {navLinks.map(({ to, icon, label }) =>
              isSuspended ? (
                <div key={to} className={disabledNavClass} title="Account suspended">
                  <span className="text-lg opacity-40">{icon}</span>
                  <span className="opacity-40">{label}</span>
                  <span className="ml-auto text-[10px] text-red-400/60 font-bold">LOCKED</span>
                </div>
              ) : (
                <NavLink key={to} to={to} className={navClass} onClick={() => setSidebarOpen(false)}>
                  <span className="text-lg">{icon}</span> {label}
                </NavLink>
              )
            )}

            {/* Support always accessible */}
            <NavLink
              to="/user/support"
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-500 text-sm font-bold tracking-tight ${isActive
                  ? "bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] shadow-[0_10px_20px_rgba(45,212,191,0.2)]"
                  : isSuspended
                    ? "text-[#2DD4BF]/80 bg-[#2DD4BF]/5 border border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/10"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-lg">👥</span>
              Support
              {isSuspended && (
                <span className="ml-auto text-[10px] text-[#2DD4BF] font-black bg-[#2DD4BF]/10 px-2 py-0.5 rounded-full">
                  AVAILABLE
                </span>
              )}
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* MAIN SECTION */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* TOPBAR */}
        <header className="flex justify-between items-center bg-[#080C1C]/60 backdrop-blur-md px-4 md:px-10 py-5 border-b border-white/5 z-10">
          <button
            className="md:hidden text-white w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div className="flex items-center gap-4 ml-auto">
            {isSuspended && (
              <div className="hidden sm:flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs font-bold text-red-400 tracking-tight">Suspended</span>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-2xl">
              <div className={`w-2 h-2 rounded-full ${isSuspended ? "bg-red-500" : "bg-[#2DD4BF] animate-pulse"}`} />
              <span className="text-xs font-bold text-white/60 tracking-tight">
                {user?.username || "User"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#2DD4BF]/10 active:scale-95 transition-transform"
            >
              Logout
            </button>
          </div>
        </header>

        {/* SUSPENDED FULL-SCREEN OVERLAY for non-support routes */}
        {isSuspended && !location.pathname.startsWith("/user/support") ? (
          <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-500/5 blur-[100px] rounded-full" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md w-full text-center bg-white/[0.03] border border-red-500/20 rounded-3xl p-10 backdrop-blur-2xl shadow-2xl"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-4xl">
                🔒
              </div>
              <h2 className="text-2xl font-black font-serif italic text-red-400 mb-3">Account Suspended</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Your account has been suspended by an administrator. You cannot access this feature.
                Please visit the Support page to get help or appeal this decision.
              </p>
              <NavLink
                to="/user/support"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-transform active:scale-95 hover:scale-105"
              >
                👥 Go to Support
              </NavLink>
            </motion.div>
          </div>
        ) : (
          /* CONTENT AREA */
          <div className="flex-1 overflow-y-auto relative custom-scrollbar">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#2DD4BF]/5 blur-[120px] rounded-full" />
            </div>
            <div className="relative z-10">
              <Outlet />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};