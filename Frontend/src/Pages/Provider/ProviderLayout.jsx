
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useContext, useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { UserContext } from "../../Context/UserContext";

// axios.defaults.withCredentials = true;

// const ProviderLayout = () => {
//   const navigate = useNavigate();
//   const { user, setUser } = useContext(UserContext);

//   // ================= COUNTS =================
//   const [counts, setCounts] = useState({
//     newAppointments: 0,
//     urgentRequests: 0,
//   });

//   const fetchCounts = async () => {
//     try {
//       const [newRes, urgentRes] = await Promise.all([
//         axios.get("http://localhost:3000/api/appointments/new"),
//         axios.get("http://localhost:3000/api/appointments/urgent"),
//       ]);

//       setCounts({
//         newAppointments: newRes.data?.total || 0,
//         urgentRequests: urgentRes.data?.appointments?.length || 0,
//       });
//     } catch (err) {
//       console.log("Notification error:", err.message);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchCounts();
//   }, [user]);

//   // ================= LOGOUT =================
//   const handleLogout = async () => {
//     try {
//       await axios.post("http://localhost:3000/api/auth/logout");
//     } catch (err) {
//       console.log(err.message);
//     }

//     setUser(null);
//     navigate("/login");
//   };

//   // ================= ROLE =================
//   const isProvider = useMemo(() => {
//     return ["approved_provider", "pending_provider"].includes(user?.role);
//   }, [user?.role]);

//   // ================= STATUS COLOR =================
//   const getStatusColor = () => {
//     if (user.role === "approved_provider") return "text-green-500";
//     if (user.role === "pending_provider") return "text-yellow-500";
//     return "text-gray-500";
//   };

//   // ================= NAV STYLE =================
//   const navClass = ({ isActive }) =>
//     `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
//       isActive
//         ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
//         : "text-gray-600 hover:bg-gray-100"
//     }`;

//   // ================= LOADING =================
//   if (!user) {
//     return (
//       <div className="flex items-center justify-center h-screen text-lg">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-100">

//       {/* ================= SIDEBAR ================= */}
//       <div className="w-64 bg-white shadow-lg flex flex-col justify-between p-5">

//         {/* TOP */}
//         <div>
//           {/* LOGO */}
//           <div className="flex items-center gap-3 mb-8">
//             <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg font-bold">
//               EF
//             </div>
//             <div>
//               <h2 className="font-bold text-lg">EasyFind</h2>
//               <p className="text-xs text-gray-400">
//                 Provider Panel
//               </p>
//             </div>
//           </div>

//           {/* MENU */}
//           {isProvider && (
//             <>
//               <p className="text-xs text-gray-400 mb-3">Quick Actions</p>

//               <ul className="space-y-2">

//                 <li>
//                   <NavLink to="/provider/dashboard" className={navClass}>
//                     <span>🏠 Dashboard</span>
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink to="/provider/appointments" className={navClass}>
//                     <span>📅 Appointments</span>

//                     {counts.newAppointments > 0 && (
//                       <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                         {counts.newAppointments}
//                       </span>
//                     )}
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink to="/provider/urgent" className={navClass}>
//                     <span>⚡ Urgent Requests</span>

//                     {counts.urgentRequests > 0 && (
//                       <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                         {counts.urgentRequests}
//                       </span>
//                     )}
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink to="/provider/chats" className={navClass}>
//                     <span>💬 Chats</span>
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink to="/provider/services" className={navClass}>
//                     <span>🛠 Services</span>
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink to="/provider/profile" className={navClass}>
//                     <span>👤 Profile</span>
//                   </NavLink>
//                 </li>

//               </ul>
//             </>
//           )}
//         </div>

//         {/* LOGOUT */}
//         <div>
//           <button
//             onClick={handleLogout}
//             className="w-full text-left text-red-500 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition"
//           >
//             🚪 Logout
//           </button>
//         </div>
//       </div>

//       {/* ================= MAIN ================= */}
//       <div className="flex-1 flex flex-col overflow-hidden">

//         {/* TOPBAR */}
//         <div className="flex justify-end items-center bg-white px-6 py-4 shadow-sm">

//           <div className="flex items-center gap-6">

//             {/* STATUS */}
//             <span className={`font-semibold ${getStatusColor()}`}>
//               {user.role === "approved_provider"
//                 ? "Active Provider"
//                 : "Pending Approval"}
//             </span>

//             {/* USER */}
//             <span className="font-medium">
//               {user?.username || "Provider"}
//             </span>

//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white px-4 py-1 rounded-lg"
//             >
//               Logout
//             </button>

//           </div>
//         </div>

//         {/* ✅ ONLY THIS SCROLLS */}
//         <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
//           <Outlet />
//         </div>

//       </div>
//     </div>
//   );
// };

// export { ProviderLayout };



















/// WITH NEW COLOR THIM








import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

axios.defaults.withCredentials = true;

const ProviderLayout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

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
    if (user.role === "approved_provider") return "text-green-400";
    if (user.role === "pending_provider") return "text-yellow-400";
    return "text-slate-400";
  };

  // ================= NAV STYLE =================
  const navClass = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
      isActive
        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
        : "text-slate-300 hover:bg-slate-700/50"
    }`;

  // ================= LOADING =================
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-lg bg-[#070A1A] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#070A1A] text-white">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-slate-800/80 backdrop-blur-xl border-r border-slate-700 flex flex-col justify-between p-5">

        {/* TOP */}
        <div>
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg font-bold">
              EF
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">EasyFind</h2>
              <p className="text-xs text-slate-400">
                Provider Panel
              </p>
            </div>
          </div>

          {/* MENU */}
          {isProvider && (
            <>
              <p className="text-xs text-slate-400 mb-3">Quick Actions</p>

              <ul className="space-y-2">

                <li>
                  <NavLink to="/provider/dashboard" className={navClass}>
                    <span>🏠 Dashboard</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/provider/appointments" className={navClass}>
                    <span>📅 Appointments</span>

                    {counts.newAppointments > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {counts.newAppointments}
                      </span>
                    )}
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/provider/urgent" className={navClass}>
                    <span>⚡ Urgent Requests</span>

                    {counts.urgentRequests > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {counts.urgentRequests}
                      </span>
                    )}
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/provider/chats" className={navClass}>
                    <span>💬 Chats</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/provider/services" className={navClass}>
                    <span>🛠 Services</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/provider/profile" className={navClass}>
                    <span>👤 Profile</span>
                  </NavLink>
                </li>

              </ul>
            </>
          )}
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

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOPBAR */}
        <div className="flex justify-end items-center bg-slate-800/80 backdrop-blur-xl border-b border-slate-700 px-6 py-4">

          <div className="flex items-center gap-6">

            {/* STATUS */}
            <span className={`font-semibold ${getStatusColor()}`}>
              {user.role === "approved_provider"
                ? "Active Provider"
                : "Pending Approval"}
            </span>

            {/* USER */}
            <span className="font-medium text-slate-200">
              {user?.username || "Provider"}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded-lg"
            >
              Logout
            </button>

          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#070A1A]">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export { ProviderLayout };