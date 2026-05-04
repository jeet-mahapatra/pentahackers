
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import axios from "axios";
// import { UserContext } from "../../Context/UserContext";

// axios.defaults.withCredentials = true;

// export const UserLayout = () => {
//   const navigate = useNavigate();
//   const { user, setUser } = useContext(UserContext);

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

//   // ================= NAV STYLE =================
//   const navClass = ({ isActive }) =>
//     `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
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
//     <div className="flex h-screen bg-gray-100">

//       {/* ================= SIDEBAR ================= */}
//       <div className="w-64 bg-white shadow-lg flex flex-col justify-between p-5">

//         {/* TOP SECTION */}
//         <div>
//           {/* LOGO */}
//           <div className="flex items-center gap-3 mb-8">
//             <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg font-bold">
//               EF
//             </div>
//             <div>
//               <h2 className="font-bold text-lg">EasyFind</h2>
//               <p className="text-xs text-gray-400">
//                 Find verified professionals
//               </p>
//             </div>
//           </div>

//           {/* MENU */}
//           <p className="text-xs text-gray-400 mb-3">Quick Actions</p>

//           <ul className="space-y-2">
//             <li>
//               <NavLink to="/user/dashboard" className={navClass}>
//                 🏠 Dashboard
//               </NavLink>
//             </li>

//             <li>
//               <NavLink to="/user/findservices" className={navClass}>
//                 🔍 Find Services
//               </NavLink>
//             </li>

//             <li>
//               <NavLink to="/user/bookings" className={navClass}>
//                 📅 My Appointments
//               </NavLink>
//             </li>

//             <li>
//               <NavLink to="/user/chats" className={navClass}>
//                 💬 Chats
//               </NavLink>
//             </li>

//             <li>
//               <NavLink to="/user/reviews" className={navClass}>
//                 ⭐ My Reviews
//               </NavLink>
//             </li>

//             <li>
//               <NavLink to="/user/profile" className={navClass}>
//                 👤 Profile Settings
//               </NavLink>
//             </li>
//           </ul>
//         </div>

//         {/* BOTTOM LOGOUT */}
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
//       <div className="flex-1 flex flex-col">

//         {/* ================= TOPBAR ================= */}
//         <div className="flex justify-end items-center bg-white px-6 py-4 shadow-sm">

//           <div className="flex items-center gap-4">
//             <span className="text-gray-600">🔔</span>

//             <span className="font-medium">
//               {user?.username || "User"}
//             </span>

//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white px-4 py-1 rounded-lg"
//             >
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* ================= CONTENT ================= */}
//         <div className="p-6 overflow-y-auto">
//           <Outlet />
//         </div>

//       </div>
//     </div>
//   );
// };










// // // BLACK THIM CODE 







import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

axios.defaults.withCredentials = true;

export const UserLayout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

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

      {/* SIDEBAR */}
      <div className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-lg flex flex-col justify-between p-5">

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
              <NavLink to="/user/dashboard" className={navClass}>
                🏠 Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/user/findservices" className={navClass}>
                🔍 Find Services
              </NavLink>
            </li>

            <li>
              <NavLink to="/user/bookings" className={navClass}>
                📅 My Appointments
              </NavLink>
            </li>

            <li>
              <NavLink to="/user/chats" className={navClass}>
                💬 Chats
              </NavLink>
            </li>

            <li>
              <NavLink to="/user/reviews" className={navClass}>
                ⭐ My Reviews
              </NavLink>
            </li>

            <li>
              <NavLink to="/user/profile" className={navClass}>
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
        <div className="flex justify-end items-center bg-white/5 backdrop-blur-xl px-6 py-4 border-b border-white/10">

          <div className="flex items-center gap-4">

            <span className="text-gray-400">🔔</span>

            <span className="font-medium text-white">
              {user?.username || "User"}
            </span>

            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white px-4 py-1 rounded-lg"
            >
              Logout
            </button>

          </div>

        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
};