



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";

// axios.defaults.withCredentials = true;

// const UrgentRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ================= FETCH URGENT =================
//   const fetchUrgent = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/api/appointments/urgent",
//         { withCredentials: true }
//       );

//       setRequests(res.data.appointments || []);
//     } catch (err) {
//       console.log("Urgent error:", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUrgent();
//   }, []);

//   // ================= ACCEPT =================
//   const handleAccept = async (id) => {
//     try {
//       await axios.patch(
//         `http://localhost:3000/api/appointments/accept/${id}`,
//         {},
//         { withCredentials: true }
//       );

//       setRequests((prev) =>
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

//       setRequests((prev) =>
//         prev.filter((item) => item._id !== id)
//       );
//     } catch (err) {
//       console.log("Cancel error:", err.response?.data || err.message);
//     }
//   };

//   return (
//     <div className="h-full flex flex-col bg-gray-100">

//       {/* ================= HEADER (FIXED) ================= */}
//       <div className="bg-red-500 text-white p-5 rounded-xl m-4 shadow-lg">
//         <h2 className="text-2xl font-bold">🚨 Urgent Requests</h2>
//         <p className="text-sm">Handle emergency services quickly</p>
//       </div>

//       {/* ================= SCROLLABLE LIST ================= */}
//       <div className="flex-1 overflow-y-auto px-4 pb-4">

//         {loading ? (
//           <p className="text-center text-gray-500 mt-10">Loading...</p>
//         ) : requests.length === 0 ? (
//           <p className="text-center text-gray-500 mt-10">
//             No urgent requests
//           </p>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

//             <AnimatePresence>
//               {requests.map((item) => (
//                 <motion.div
//                   key={item._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.3 }}
//                   className="bg-white p-5 rounded-xl shadow border-l-4 border-red-500"
//                 >

//                   {/* INFO */}
//                   <h3 className="font-bold text-lg">
//                     {item.requestType}
//                   </h3>

//                   <p className="text-sm text-gray-500">
//                     👤 {item.serviceUser?.username}
//                   </p>

//                   <p className="text-sm text-gray-500">
//                     📧 {item.serviceUser?.email}
//                   </p>

//                   {/* ✅ FIXED DATE + TIME */}
//                   <p className="text-sm mt-2 text-gray-600">
//                     📅{" "}
//                     {item.appointmentDate
//                       ? new Date(item.appointmentDate).toLocaleDateString()
//                       : "N/A"}
//                   </p>

//                   <p className="text-sm text-gray-600">
//                     ⏰ {item.appointmentTime || "Not specified"}
//                   </p>

//                   <p className="text-red-500 font-semibold mt-1">
//                     ⚠️ URGENT
//                   </p>

//                   {/* BUTTONS */}
//                   <div className="flex gap-2 mt-4">

//                     <button
//                       onClick={() => handleAccept(item._id)}
//                       className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
//                     >
//                       Accept
//                     </button>

//                     <button
//                       onClick={() => handleCancel(item._id)}
//                       className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
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

// export { UrgentRequests };












// CHANGED COLOR THIM  










import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

axios.defaults.withCredentials = true;

const UrgentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUrgent = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/appointments/urgent",
        { withCredentials: true }
      );

      setRequests(res.data.appointments || []);
    } catch (err) {
      console.log("Urgent error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrgent();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/appointments/accept/${id}`,
        {},
        { withCredentials: true }
      );

      setRequests((prev) =>
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

      setRequests((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.log("Cancel error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#070A1A] text-white">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-5 rounded-xl m-4 shadow-lg">
        <h2 className="text-2xl font-bold">🚨 Urgent Requests</h2>
        <p className="text-sm opacity-90">Handle emergency services quickly</p>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">

        {loading ? (
          <p className="text-center text-slate-400 mt-10">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-slate-400 mt-10">
            No urgent requests
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            <AnimatePresence>
              {requests.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800 p-5 rounded-xl shadow border-l-4 border-red-500"
                >

                  <h3 className="font-bold text-lg text-white">
                    {item.requestType}
                  </h3>

                  <p className="text-sm text-slate-400">
                    👤 {item.serviceUser?.username}
                  </p>

                  <p className="text-sm text-slate-400">
                    📧 {item.serviceUser?.email}
                  </p>

                  <p className="text-sm mt-2 text-slate-300">
                    📅{" "}
                    {item.appointmentDate
                      ? new Date(item.appointmentDate).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <p className="text-sm text-slate-300">
                    ⏰ {item.appointmentTime || "Not specified"}
                  </p>

                  <p className="text-red-400 font-semibold mt-1">
                    ⚠️ URGENT
                  </p>

                  <div className="flex gap-2 mt-4">

                    <button
                      onClick={() => handleAccept(item._id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleCancel(item._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
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

export { UrgentRequests };