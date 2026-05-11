
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

axios.defaults.withCredentials = true;

const ProviderLayout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  // ================= SIDEBAR TOGGLE (mobile only) =================
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ================= COUNTS =================
  const [counts, setCounts] = useState({
    newAppointments: 0,
    urgentRequests: 0,
  });

  const fetchCounts = async () => {
    try {
      const [newRes, urgentRes] = await Promise.all([
        axios.get("http://localhost:3000/api/appointments/new"),
        axios.get("http://localhost:3000/api/appointments/urgent"),
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
    if (user) fetchCounts();
  }, [user]);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout");
    } catch (err) {
      console.log(err.message);
    }

    setUser(null);
    navigate("/login");
  };

  // ================= ROLE =================
  const isProvider = useMemo(() => {
    return ["approved_provider", "pending_provider"].includes(user?.role);
  }, [user?.role]);

  // ================= STATUS COLOR =================
  const getStatusColor = () => {
    if (user.role === "approved_provider") return "text-[#34D399]"; // Emerald
    if (user.role === "pending_provider") return "text-[#F59E0B]"; // Amber
    return "text-white/40";
  };

  // ================= NAV STYLE =================
  const navClass = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-[14px] font-semibold tracking-wide ${
      isActive
        ? "bg-gradient-to-r from-[#2DD4BF]/15 to-[#0EA5E9]/15 text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-[0_4px_20px_rgba(45,212,191,0.15)]"
        : "text-white/50 hover:bg-white/[0.04] hover:text-white border border-transparent"
    }`;

  // ================= LOADING =================
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

  return (
    <div 
      className="flex h-screen overflow-hidden"
      style={{ 
        background: "#080C1C", 
        color: "#fff",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" 
      }}
    >
      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#080C1C]/80 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed md:static z-30 h-full w-64 bg-[#080C1C]/90 backdrop-blur-2xl border-r border-white/[0.05] flex flex-col justify-between p-5 transition-transform duration-300 shadow-[20px_0_40px_rgba(0,0,0,0.5)]
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* TOP */}
        <div>
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-8 px-2">
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

          {/* MENU */}
          {isProvider && (
            <>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-4 px-2">Quick Actions</p>

              <ul className="space-y-2">
                <li>
                  <NavLink to="/provider/dashboard" className={navClass} onClick={() => setSidebarOpen(false)}>
                    <span className="flex items-center gap-3">🏠 Dashboard</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/provider/appointments" className={navClass} onClick={() => setSidebarOpen(false)}>
                    <span className="flex items-center gap-3">📅 Appointments</span>
                    {counts.newAppointments > 0 && (
                      <span className="bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {counts.newAppointments}
                      </span>
                    )}
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/provider/urgent" className={navClass} onClick={() => setSidebarOpen(false)}>
                    <span className="flex items-center gap-3">⚡ Urgent Requests</span>
                    {counts.urgentRequests > 0 && (
                      <span className="bg-[#FB923C]/20 text-[#FB923C] border border-[#FB923C]/30 text-[11px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        {counts.urgentRequests}
                      </span>
                    )}
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/provider/chats" className={navClass} onClick={() => setSidebarOpen(false)}>
                    <span className="flex items-center gap-3">💬 Chats</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/provider/services" className={navClass} onClick={() => setSidebarOpen(false)}>
                    <span className="flex items-center gap-3">🛠 Services</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/provider/support" className={navClass} onClick={() => setSidebarOpen(false)}>
                    <span className="flex items-center gap-3">👥 Support</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/provider/profile" className={navClass} onClick={() => setSidebarOpen(false)}>
                    <span className="flex items-center gap-3">👤 Profile</span>
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

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Ambient background glow behind the main content area */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(45,212,191,0.05)_0%,transparent_70%)] rounded-full blur-[80px] pointer-events-none" />

        {/* TOPBAR */}
        <div className="flex justify-between items-center bg-[#080C1C]/60 backdrop-blur-2xl border-b border-white/[0.05] px-4 md:px-8 py-4 z-10">

          {/* HAMBURGER (mobile only) */}
          <button
            className="md:hidden text-white/80 hover:text-white text-2xl leading-none transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div className="flex items-center gap-4 md:gap-6 ml-auto">

            {/* STATUS */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${user.role === "approved_provider" ? "bg-[#34D399]" : "bg-[#F59E0B]"}`} />
              <span className={`font-bold text-[12px] uppercase tracking-wider ${getStatusColor()}`}>
                {user.role === "approved_provider" ? "Active Provider" : "Pending"}
              </span>
            </div>

            <div className="h-5 w-px bg-white/[0.1] hidden sm:block"></div>

            {/* USER */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2DD4BF] to-[#0EA5E9] p-[2px]">
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

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth z-10 relative">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export { ProviderLayout };