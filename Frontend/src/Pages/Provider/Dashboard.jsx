
// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { UserContext } from "../../Context/UserContext";

// axios.defaults.withCredentials = true;

// const Dashboard = () => {
//   const { user } = useContext(UserContext);

//   const [stats, setStats] = useState({
//     totalRequests: 0,
//     totalNew: 0,
//     pending: 0,
//     completed: 0,
//     cancelled: 0, // ✅ added
//   });

//   const [pendingAppointments, setPendingAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ================= FETCH STATS =================
//   const fetchStats = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/api/appointments/stats",
//         { withCredentials: true }
//       );

//       setStats(res.data);
//     } catch (err) {
//       console.log("Stats error:", err.response?.data || err.message);
//     }
//   };

//   // ================= FETCH PENDING =================
//   const fetchPending = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/api/appointments/pending",
//         { withCredentials: true }
//       );

//       // ✅ SORT BY DATE + TIME
//       const sorted = (res.data.appointments || []).sort((a, b) => {
//         const dateA = new Date(a.appointmentDate);
//         const dateB = new Date(b.appointmentDate);
//         return dateA - dateB;
//       });

//       setPendingAppointments(sorted);
//     } catch (err) {
//       console.log("Pending error:", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= COMPLETE =================
//   const handleComplete = async (id) => {
//     try {
//       await axios.patch(
//         `http://localhost:3000/api/appointments/complete/${id}`,
//         {},
//         { withCredentials: true }
//       );

//       setPendingAppointments((prev) =>
//         prev.filter((item) => item._id !== id)
//       );

//       fetchStats();
//     } catch (err) {
//       console.log("Complete error:", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//     fetchPending();
//   }, []);

//   return (
//     <div className="h-screen overflow-hidden p-4 md:p-6 flex flex-col space-y-5">

//       {/* ================= HEADER ================= */}
//       <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-5 rounded-xl shrink-0">
//         <h2 className="text-xl font-bold">
//           Welcome, {user?.username || "Provider"}
//         </h2>
//         <p className="text-sm">
//           Manage appointments efficiently
//         </p>
//       </div>

//       {/* ================= STATS ================= */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0">

//         <StatCard title="Total" value={stats.totalRequests} />
//         <StatCard title="New" value={stats.totalNew} />
//         <StatCard title="Pending" value={stats.pending} />
//         <StatCard title="Completed" value={stats.completed} />
//         <StatCard title="Cancelled" value={stats.cancelled} /> {/* ✅ NEW */}

//       </div>

//       {/* ================= PENDING ================= */}
//       <div className="bg-white p-4 rounded-xl shadow flex-1 flex flex-col overflow-hidden">

//         <h3 className="text-lg font-bold mb-3 shrink-0">
//           Pending Appointments
//         </h3>

//         {loading ? (
//           <p className="text-gray-500">Loading...</p>
//         ) : pendingAppointments.length === 0 ? (
//           <p className="text-gray-500">No pending requests</p>
//         ) : (
//           <div className="space-y-2 overflow-y-auto pr-2 flex-1">

//             {pendingAppointments.map((item) => (
//               <div
//                 key={item._id}
//                 className="border p-3 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-3"
//               >

//                 {/* LEFT INFO */}
//                 <div className="text-sm">

//                   <p className="font-semibold">
//                     {item.requestType}
//                   </p>

//                   <p className="text-gray-500">
//                     👤 {item.serviceUser?.username}
//                   </p>

//                   <p className="text-gray-500">
//                     📅 {new Date(item.appointmentDate).toLocaleDateString()}
//                   </p>

//                   <p className="text-gray-500">
//                     ⏰ {item.appointmentTime || "Not set"}
//                   </p>

//                   <p>
//                     Status:{" "}
//                     <span className="font-medium text-yellow-600">
//                       {item.status}
//                     </span>
//                   </p>

//                 </div>

//                 {/* BUTTON */}
//                 <button
//                   onClick={() => handleComplete(item._id)}
//                   className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm"
//                 >
//                   Complete
//                 </button>

//               </div>
//             ))}

//           </div>
//         )}

//       </div>

//     </div>
//   );
// };

// export { Dashboard };


// // ================= SMALLER CARD =================
// const StatCard = ({ title, value }) => {
//   return (
//     <div className="bg-white p-3 rounded-lg shadow text-center">
//       <p className="text-xs text-gray-500">{title}</p>
//       <h2 className="text-lg font-bold">{value}</h2>
//     </div>
//   );
// };



















// // COLOR THIM CHANGE 






import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

axios.defaults.withCredentials = true;

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
      const res = await axios.get(
        "http://localhost:3000/api/appointments/stats",
        { withCredentials: true }
      );
      setStats(res.data);
    } catch (err) {
      console.log("Stats error:", err.response?.data || err.message);
    }
  };

  const fetchPending = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/appointments/pending",
        { withCredentials: true }
      );

      const sorted = (res.data.appointments || []).sort((a, b) => {
        const dateA = new Date(a.appointmentDate);
        const dateB = new Date(b.appointmentDate);
        return dateA - dateB;
      });

      setPendingAppointments(sorted);
    } catch (err) {
      console.log("Pending error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/appointments/complete/${id}`,
        {},
        { withCredentials: true }
      );

      setPendingAppointments((prev) =>
        prev.filter((item) => item._id !== id)
      );

      fetchStats();
    } catch (err) {
      console.log("Complete error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPending();
  }, []);

  return (
    <div className="h-screen overflow-hidden p-4 md:p-6 flex flex-col space-y-5 bg-[#070A1A] text-white">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-5 rounded-xl shrink-0 shadow-lg">
        <h2 className="text-xl font-bold">
          Welcome, {user?.username || "Provider"}
        </h2>
        <p className="text-sm text-indigo-100">
          Manage appointments efficiently
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0">
        <StatCard title="Total" value={stats.totalRequests} />
        <StatCard title="New" value={stats.totalNew} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Cancelled" value={stats.cancelled} />
      </div>

      {/* PENDING */}
      <div className="bg-slate-800/80 backdrop-blur-lg p-4 rounded-xl border border-slate-700 flex-1 flex flex-col overflow-hidden">

        <h3 className="text-lg font-bold mb-3 shrink-0 text-indigo-300">
          Pending Appointments
        </h3>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : pendingAppointments.length === 0 ? (
          <p className="text-slate-400">No pending requests</p>
        ) : (
          <div className="space-y-2 overflow-y-auto pr-2 flex-1">

            {pendingAppointments.map((item) => (
              <div
                key={item._id}
                className="border border-slate-700 bg-slate-900/60 p-3 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-3"
              >

                <div className="text-sm">

                  <p className="font-semibold text-white">
                    {item.requestType}
                  </p>

                  <p className="text-slate-400">
                    👤 {item.serviceUser?.username}
                  </p>

                  <p className="text-slate-400">
                    📅 {new Date(item.appointmentDate).toLocaleDateString()}
                  </p>

                  <p className="text-slate-400">
                    ⏰ {item.appointmentTime || "Not set"}
                  </p>

                  <p>
                    Status:{" "}
                    <span className="font-medium text-yellow-400">
                      {item.status}
                    </span>
                  </p>

                </div>

                <button
                  onClick={() => handleComplete(item._id)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white px-3 py-2 rounded text-sm shadow-md"
                >
                  Complete
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export { Dashboard };


// STAT CARD
const StatCard = ({ title, value }) => {
  return (
    <div className="bg-slate-800/80 backdrop-blur-lg border border-slate-700 p-3 rounded-lg shadow text-center">
      <p className="text-xs text-slate-400">{title}</p>
      <h2 className="text-lg font-bold text-white">{value}</h2>
    </div>
  );
};