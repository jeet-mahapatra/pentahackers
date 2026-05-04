// import { useContext } from "react";
// import { UserContext } from "../../Context/UserContext";

// export const UserProfile = () => {
//   const { user, loading } = useContext(UserContext);

//   // ================= LOADING =================
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-lg">
//         Loading profile...
//       </div>
//     );
//   }

//   // ================= ERROR =================
//   if (!user) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-500 text-lg">
//         ❌ Failed to load profile
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

//       {/* HEADER */}
//       <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg mb-6">

//         <div className="flex items-center gap-5">

//           {/* AVATAR */}
//           <div className="w-20 h-20 rounded-full bg-white text-purple-600 flex items-center justify-center text-3xl font-bold shadow-md">
//             {user.username?.charAt(0).toUpperCase()}
//           </div>

//           {/* USER INFO */}
//           <div>
//             <h1 className="text-2xl font-bold capitalize">
//               {user.username}
//             </h1>
//             <p className="text-sm opacity-90">{user.email}</p>
//             <p className="text-xs mt-1 bg-white/20 inline-block px-3 py-1 rounded-full capitalize">
//               {user.role}
//             </p>
//           </div>

//         </div>
//       </div>

//       {/* MAIN CARD */}
//       <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">

//         {/* BASIC INFO */}
//         <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition">

//           <h2 className="text-lg font-semibold mb-4 text-gray-700">
//             📌 Basic Information
//           </h2>

//           <div className="space-y-3 text-gray-600">

//             <p>
//               <span className="font-medium">Username:</span> {user.username}
//             </p>

//             <p>
//               <span className="font-medium">Email:</span> {user.email}
//             </p>

//             <p>
//               <span className="font-medium">Role:</span> {user.role}
//             </p>

//           </div>
//         </div>

//         {/* PROVIDER EXTRA INFO */}
//         <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition">

//           <h2 className="text-lg font-semibold mb-4 text-gray-700">
//             ⚙️ Additional Details
//           </h2>

//           {user.serviceType ? (
//             <div className="space-y-3 text-gray-600">

//               <p>
//                 <span className="font-medium">Service:</span> {user.serviceType}
//               </p>

//               <div>
//                 <p className="font-medium mb-2">Available Slots:</p>

//                 <div className="flex flex-wrap gap-2">
//                   {user.timeSlots?.map((slot, i) => (
//                     <span
//                       key={i}
//                       className="bg-purple-100 text-purple-600 px-2 py-1 rounded-lg text-sm"
//                     >
//                       {slot}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//             </div>
//           ) : (
//             <p className="text-gray-400 text-sm">
//               No additional details available
//             </p>
//           )}

//         </div>

//       </div>

//     </div>
//   );
// };








// BLACKE COLOR THIM   







import { useContext } from "react";
import { UserContext } from "../../Context/UserContext";

export const UserProfile = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg bg-[#070A1A] text-gray-300">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-red-400 text-lg bg-[#070A1A]">
        ❌ Failed to load profile
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A1A] p-6 text-white">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-6">

        <div className="flex items-center gap-5">

          {/* AVATAR */}
          <div className="w-20 h-20 rounded-full bg-white text-purple-600 flex items-center justify-center text-3xl font-bold shadow-md">
            {user.username?.charAt(0).toUpperCase()}
          </div>

          {/* USER INFO */}
          <div>
            <h1 className="text-2xl font-bold capitalize">
              {user.username}
            </h1>
            <p className="text-sm text-gray-200">{user.email}</p>
            <p className="text-xs mt-1 bg-white/20 inline-block px-3 py-1 rounded-full capitalize">
              {user.role}
            </p>
          </div>

        </div>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">

        {/* BASIC INFO */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-md hover:shadow-xl transition text-white">

          <h2 className="text-lg font-semibold mb-4 text-cyan-400">
            📌 Basic Information
          </h2>

          <div className="space-y-3 text-gray-300">

            <p>
              <span className="font-medium text-white">Username:</span> {user.username}
            </p>

            <p>
              <span className="font-medium text-white">Email:</span> {user.email}
            </p>

            <p>
              <span className="font-medium text-white">Role:</span> {user.role}
            </p>

          </div>
        </div>

        {/* PROVIDER EXTRA INFO */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-md hover:shadow-xl transition text-white">

          <h2 className="text-lg font-semibold mb-4 text-cyan-400">
            ⚙️ Additional Details
          </h2>

          {user.serviceType ? (
            <div className="space-y-3 text-gray-300">

              <p>
                <span className="font-medium text-white">Service:</span>{" "}
                {user.serviceType}
              </p>

              <div>
                <p className="font-medium mb-2 text-white">Available Slots:</p>

                <div className="flex flex-wrap gap-2">
                  {user.timeSlots?.map((slot, i) => (
                    <span
                      key={i}
                      className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-lg text-sm"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              No additional details available
            </p>
          )}

        </div>

      </div>

    </div>
  );
};