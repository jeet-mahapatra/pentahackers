
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";

// axios.defaults.withCredentials = true;

// const Appointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ================= FETCH NEW APPOINTMENTS =================
//   const fetchAppointments = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/api/appointments/new",
//         { withCredentials: true }
//       );

//       setAppointments(res.data.appointments);
//     } catch (err) {
//       console.log("Fetch error:", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= ACCEPT =================
//   const handleAccept = async (id) => {
//     try {
//       await axios.patch(
//         `http://localhost:3000/api/appointments/accept/${id}`,
//         {},
//         { withCredentials: true }
//       );

//       setAppointments((prev) =>
//         prev.filter((item) => item._id !== id)
//       );
//     } catch (err) {
//       console.log("Accept error:", err.response?.data || err.message);
//     }
//   };

//   // ================= CANCEL =================
//   const handleCancel = async (id) => {
//     try {
//       await axios.patch(
//         `http://localhost:3000/api/appointments/cancel/${id}`,
//         {},
//         { withCredentials: true }
//       );

//       setAppointments((prev) =>
//         prev.filter((item) => item._id !== id)
//       );
//     } catch (err) {
//       console.log("Cancel error:", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   return (
//     <div className="h-full flex flex-col bg-gray-100">

//       {/* ================= HEADER (FIXED) ================= */}
//       <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg m-4">
//         <h2 className="text-2xl font-bold">New Service Requests</h2>
//         <p className="text-sm opacity-90">
//           Manage incoming appointments efficiently
//         </p>
//       </div>

//       {/* ================= SCROLLABLE LIST ================= */}
//       <div className="flex-1 overflow-y-auto px-4 pb-4">

//         {loading ? (
//           <p className="text-center text-gray-500 mt-10">Loading...</p>
//         ) : appointments.length === 0 ? (
//           <p className="text-center text-gray-500 mt-10">
//             No new appointments
//           </p>
//         ) : (
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

//             <AnimatePresence>
//               {appointments.map((item) => (
//                 <motion.div
//                   key={item._id}
//                   initial={{ opacity: 0, y: 20, scale: 0.95 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.3 }}
//                   className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-2xl transition"
//                 >

//                   {/* USER INFO */}
//                   <div className="mb-3">
//                     <h3 className="text-lg font-bold text-gray-800">
//                       {item.requestType}
//                     </h3>

//                     <p className="text-sm text-gray-500">
//                       👤 {item.serviceUser?.username}
//                     </p>

//                     <p className="text-sm text-gray-500">
//                       📧 {item.serviceUser?.email}
//                     </p>
//                   </div>

//                   {/* DETAILS */}
//                   <div className="text-sm space-y-1 text-gray-600">
//                     <p>
//                       📅{" "}
//                       {item.appointmentDate
//                         ? new Date(item.appointmentDate).toLocaleDateString()
//                         : "N/A"}
//                     </p>

//                     <p>
//                       ⏰ {item.appointmentTime || "Not specified"}
//                     </p>

//                     <p>
//                       ⚡ Urgent:{" "}
//                       <span
//                         className={
//                           item.isUrgent
//                             ? "text-red-500 font-semibold"
//                             : "text-green-500"
//                         }
//                       >
//                         {item.isUrgent ? "Yes" : "No"}
//                       </span>
//                     </p>

//                     <p>
//                       📌 Status:{" "}
//                       <span className="font-semibold text-yellow-500">
//                         {item.status}
//                       </span>
//                     </p>
//                   </div>

//                   {/* BUTTONS */}
//                   <div className="flex gap-2 mt-4">
//                     <button
//                       onClick={() => handleAccept(item._id)}
//                       className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
//                     >
//                       Accept
//                     </button>

//                     <button
//                       onClick={() => handleCancel(item._id)}
//                       className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
//                     >
//                       Cancel
//                     </button>
//                   </div>

//                 </motion.div>
//               ))}
//             </AnimatePresence>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export { Appointments };















// CHANGED COLOR THIM




import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

axios.defaults.withCredentials = true;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/appointments/new",
        { withCredentials: true }
      );

      setAppointments(res.data.appointments);
    } catch (err) {
      console.log("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/appointments/accept/${id}`,
        {},
        { withCredentials: true }
      );

      setAppointments((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.log("Accept error:", err.response?.data || err.message);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/appointments/cancel/${id}`,
        {},
        { withCredentials: true }
      );

      setAppointments((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.log("Cancel error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#070A1A] text-white">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg m-4">
        <h2 className="text-2xl font-bold">New Service Requests</h2>
        <p className="text-sm opacity-90">
          Manage incoming appointments efficiently
        </p>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">

        {loading ? (
          <p className="text-center text-slate-400 mt-10">Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-slate-400 mt-10">
            No new appointments
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <AnimatePresence>
              {appointments.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800 rounded-2xl shadow-lg p-5 border border-slate-700 hover:shadow-2xl transition"
                >

                  {/* USER INFO */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-white">
                      {item.requestType}
                    </h3>

                    <p className="text-sm text-slate-400">
                      👤 {item.serviceUser?.username}
                    </p>

                    <p className="text-sm text-slate-400">
                      📧 {item.serviceUser?.email}
                    </p>
                  </div>

                  {/* DETAILS */}
                  <div className="text-sm space-y-1 text-slate-300">
                    <p>
                      📅{" "}
                      {item.appointmentDate
                        ? new Date(item.appointmentDate).toLocaleDateString()
                        : "N/A"}
                    </p>

                    <p>
                      ⏰ {item.appointmentTime || "Not specified"}
                    </p>

                    <p>
                      ⚡ Urgent:{" "}
                      <span
                        className={
                          item.isUrgent
                            ? "text-red-400 font-semibold"
                            : "text-green-400"
                        }
                      >
                        {item.isUrgent ? "Yes" : "No"}
                      </span>
                    </p>

                    <p>
                      📌 Status:{" "}
                      <span className="font-semibold text-yellow-400">
                        {item.status}
                      </span>
                    </p>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleAccept(item._id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleCancel(item._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>

          </div>
        )}

      </div>
    </div>
  );
};

export { Appointments };