import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

axios.defaults.withCredentials = true;

export const UserLayout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

const handleLogout = async () => {
  try {

    const res = await axios.post(
      "http://localhost:3000/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#080C1C] text-[#2DD4BF] font-serif italic text-xl">
        Loading Session...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#080C1C] text-white font-sans overflow-hidden">
      {/* GLOBAL SCROLLBAR OVERRIDE */}
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

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-50 h-full w-72 bg-[#0D1226]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col justify-between p-6 transition-all duration-500 ease-in-out
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
                Service<span className="text-[#2DD4BF]">Hub</span>
              </h2>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black mt-1">
                EasyFind Protocol
              </p>
            </div>
          </div>

          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 px-2">
            Management
          </p>

          <nav className="space-y-2">
            <NavLink to="/user/dashboard" className={navClass} onClick={() => setSidebarOpen(false)}>
              <span className="text-lg">🏠</span> Dashboard
            </NavLink>
            <NavLink to="/user/findservices" className={navClass} onClick={() => setSidebarOpen(false)}>
              <span className="text-lg">🔍</span> Find Services
            </NavLink>
            <NavLink to="/user/bookings" className={navClass} onClick={() => setSidebarOpen(false)}>
              <span className="text-lg">📅</span> Appointments
            </NavLink>
            <NavLink to="/user/chats" className={navClass} onClick={() => setSidebarOpen(false)}>
              <span className="text-lg">💬</span> Secure Chats
            </NavLink>
            <NavLink to="/user/reviews" className={navClass} onClick={() => setSidebarOpen(false)}>
              <span className="text-lg">⭐</span> My Reviews
            </NavLink>
             
                  <NavLink to="/user/support" className={navClass} onClick={() => setSidebarOpen(false)}>
                    <span className="flex items-center gap-3">👥 Support</span>
                  </NavLink>
                
            <NavLink to="/user/profile" className={navClass} onClick={() => setSidebarOpen(false)}>
              <span className="text-lg">👤</span> Profile Settings
            </NavLink>
          </nav>
        </div>

      </aside>

      {/* MAIN SECTION */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* TOPBAR */}
        <header className="flex justify-between items-center bg-[#080C1C]/60 backdrop-blur-md px-6 md:px-10 py-5 border-b border-white/5 z-30">
          <button
            className="md:hidden text-white w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-2xl">
              <div className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
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

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#2DD4BF]/5 blur-[120px] rounded-full" />
          </div>
          <div className="relative z-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};