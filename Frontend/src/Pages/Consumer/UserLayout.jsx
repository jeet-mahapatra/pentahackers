
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

axios.defaults.withCredentials = true;

export const UserLayout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  // ================= SIDEBAR TOGGLE (mobile only) =================
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout");
    } catch (err) {
      console.log(err.message);
    }

    setUser(null);
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
      isActive
        ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white shadow-md"
        : "text-gray-300 hover:bg-white/5"
    }`;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-white bg-[#070A1A]">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#070A1A] text-white">

      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed md:static z-30 h-full w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-lg flex flex-col justify-between p-5 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        {/* TOP */}
        <div>

          {/* LOGO */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white px-3 py-2 rounded-lg font-bold">
              EF
            </div>
            <div>
              <h2 className="font-bold text-lg">EasyFind</h2>
              <p className="text-xs text-gray-400">
                Find verified professionals
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-3">Quick Actions</p>

          <ul className="space-y-2">

            <li>
              <NavLink to="/user/dashboard" className={navClass} onClick={() => setSidebarOpen(false)}>
                🏠 Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/user/findservices" className={navClass} onClick={() => setSidebarOpen(false)}>
                🔍 Find Services
              </NavLink>
            </li>

            <li>
              <NavLink to="/user/bookings" className={navClass} onClick={() => setSidebarOpen(false)}>
                📅 My Appointments
              </NavLink>
            </li>

            <li>
              <NavLink to="/user/chats" className={navClass} onClick={() => setSidebarOpen(false)}>
                💬 Chats
              </NavLink>
            </li>

            <li>
              <NavLink to="/user/reviews" className={navClass} onClick={() => setSidebarOpen(false)}>
                ⭐ My Reviews
              </NavLink>
            </li>

            <li>
              <NavLink to="/user/profile" className={navClass} onClick={() => setSidebarOpen(false)}>
                👤 Profile Settings
              </NavLink>
            </li>

          </ul>
        </div>

        {/* LOGOUT */}
        <div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-400 font-semibold px-4 py-2 rounded-lg hover:bg-red-500/10 transition"
          >
            🚪 Logout
          </button>
        </div>

      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl px-4 md:px-6 py-4 border-b border-white/10">

          {/* HAMBURGER (mobile only) */}
          <button
            className="md:hidden text-white text-2xl leading-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div className="flex items-center gap-3 md:gap-4 ml-auto">

            <span className="text-gray-400">🔔</span>

            <span className="font-medium text-white hidden sm:inline">
              {user?.username || "User"}
            </span>

            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white px-3 md:px-4 py-1 rounded-lg text-sm"
            >
              Logout
            </button>

          </div>

        </div>

        {/* CONTENT */}
        <div className="p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
};