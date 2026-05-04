
// import { useEffect, useState } from "react";
// import axios from "axios";

// export const UserReviews = () => {
//   const [data, setData] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");

//   // ================= FETCH DATA =================
//   const fetchData = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/api/reviews/providers"
//       );

//       if (res.data.success) {
//         setData(res.data.data);
//       }
//     } catch (err) {
//       console.error("fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // ================= SUBMIT REVIEW =================
//   const submitReview = async () => {
//     try {
//       // 🔍 DEBUG (very important)
//       console.log("Submitting appointment:", selected.appointment._id);

//       await axios.post("http://localhost:3000/api/reviews", {
//         serviceProvider: selected.provider._id,
//         appointment: selected.appointment._id,
//         rating,
//         comment,
//       });

//       alert("✅ Review submitted!");

//       // ✅ update UI without reload
//       setData((prev) =>
//         prev.map((item) =>
//           item.appointment._id === selected.appointment._id
//             ? { ...item, isReviewed: true }
//             : item
//         )
//       );

//       // reset modal state
//       setSelected(null);
//       setRating(5);
//       setComment("");

//     } catch (err) {
//       if (err.response?.status === 400) {
//         alert(err.response.data.message);
//       } else {
//         alert("Something went wrong");
//       }
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">

//       <h2 className="text-2xl font-bold text-purple-600 mb-6">
//         ⭐ Rate Your Completed Services
//       </h2>

//       <div className="grid md:grid-cols-2 gap-5">

//         {data.length === 0 && (
//           <p className="text-gray-500">No completed services found</p>
//         )}

//         {data.map((item) => (
//           <div
//             key={item.appointment._id} // ✅ correct key
//             className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition-all"
//           >

//             <h3 className="text-lg font-bold text-gray-800">
//               {item.provider?.name}
//             </h3>

//             <p className="text-sm text-gray-500">
//               {item.provider?.serviceType}
//             </p>

//             <div className="mt-3 text-sm text-gray-600 space-y-1">
//               <p>🧾 {item.appointment?.requestType}</p>

//               <p>
//                 📅{" "}
//                 {item.appointment?.appointmentDate
//                   ? new Date(item.appointment.appointmentDate).toLocaleDateString()
//                   : "N/A"}
//               </p>

//               <p>⏰ {item.appointment?.appointmentTime}</p>
//             </div>

//             {/* BUTTON */}
//             {item.isReviewed ? (
//               <button
//                 disabled
//                 className="mt-4 bg-gray-400 text-white px-4 py-1 rounded cursor-not-allowed"
//               >
//                 Already Reviewed
//               </button>
//             ) : (
//               <button
//                 onClick={() => {
//                   console.log("Selected appointment:", item.appointment._id); // 🔍 debug
//                   setSelected(item);
//                 }}
//                 className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded"
//               >
//                 Rate ⭐
//               </button>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* MODAL */}
//       {selected && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

//           <div className="bg-white w-[360px] p-5 rounded-xl">

//             <h3 className="font-bold mb-3 text-purple-600">
//               Rate {selected.provider.name}
//             </h3>

//             {/* STARS */}
//             <div className="flex gap-2 text-2xl mb-3">
//               {[1, 2, 3, 4, 5].map((s) => (
//                 <span
//                   key={s}
//                   onClick={() => setRating(s)}
//                   className={`cursor-pointer ${
//                     s <= rating ? "text-yellow-400" : "text-gray-300"
//                   }`}
//                 >
//                   ★
//                 </span>
//               ))}
//             </div>

//             {/* COMMENT */}
//             <textarea
//               className="w-full border p-2 rounded mb-3"
//               placeholder="Write your experience..."
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//             />

//             <div className="flex justify-between">
//               <button
//                 onClick={() => setSelected(null)}
//                 className="px-3 py-1 bg-gray-300 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={submitReview}
//                 className="px-3 py-1 bg-purple-500 text-white rounded"
//               >
//                 Submit
//               </button>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };









// BLACK COLR THIM 






import { useEffect, useState } from "react";
import axios from "axios";

export const UserReviews = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/reviews/providers"
      );

      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitReview = async () => {
    try {
      console.log("Submitting appointment:", selected.appointment._id);

      await axios.post("http://localhost:3000/api/reviews", {
        serviceProvider: selected.provider._id,
        appointment: selected.appointment._id,
        rating,
        comment,
      });

      alert("✅ Review submitted!");

      setData((prev) =>
        prev.map((item) =>
          item.appointment._id === selected.appointment._id
            ? { ...item, isReviewed: true }
            : item
        )
      );

      setSelected(null);
      setRating(5);
      setComment("");
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="p-6 bg-[#070A1A] min-h-screen text-white">

      <h2 className="text-2xl font-bold text-cyan-400 mb-6">
        ⭐ Rate Your Completed Services
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        {data.length === 0 && (
          <p className="text-gray-400">No completed services found</p>
        )}

        {data.map((item) => (
          <div
            key={item.appointment._id}
            className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-xl hover:shadow-xl transition-all"
          >

            <h3 className="text-lg font-bold text-white">
              {item.provider?.name}
            </h3>

            <p className="text-sm text-gray-400">
              {item.provider?.serviceType}
            </p>

            <div className="mt-3 text-sm text-gray-300 space-y-1">
              <p>🧾 {item.appointment?.requestType}</p>

              <p>
                📅{" "}
                {item.appointment?.appointmentDate
                  ? new Date(item.appointment.appointmentDate).toLocaleDateString()
                  : "N/A"}
              </p>

              <p>⏰ {item.appointment?.appointmentTime}</p>
            </div>

            {/* BUTTON */}
            {item.isReviewed ? (
              <button
                disabled
                className="mt-4 bg-gray-600 text-gray-300 px-4 py-1 rounded cursor-not-allowed"
              >
                Already Reviewed
              </button>
            ) : (
              <button
                onClick={() => {
                  console.log("Selected appointment:", item.appointment._id);
                  setSelected(item);
                }}
                className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-1 rounded"
              >
                Rate ⭐
              </button>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-[#0F172A] border border-white/10 w-[360px] p-5 rounded-xl text-white">

            <h3 className="font-bold mb-3 text-cyan-400">
              Rate {selected.provider.name}
            </h3>

            {/* STARS */}
            <div className="flex gap-2 text-2xl mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  onClick={() => setRating(s)}
                  className={`cursor-pointer ${
                    s <= rating ? "text-yellow-400" : "text-gray-500"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* COMMENT */}
            <textarea
              className="w-full border border-white/10 bg-white/5 text-white p-2 rounded mb-3 focus:outline-none"
              placeholder="Write your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-1 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={submitReview}
                className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};