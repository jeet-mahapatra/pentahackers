
// import { useEffect, useState } from "react";
// import axios from "axios";

// axios.defaults.withCredentials = true;

// const ProviderProfile = () => {
//   const [provider, setProvider] = useState(null);

//   const [form, setForm] = useState({
//     serviceType: "",
//     address: "",
//     timeSlots: "",
//   });

//   const [idProof, setIdProof] = useState(null);
//   const [photoproof, setPhotoproof] = useState(null);

//   // ================= FETCH =================
//   const fetchProfile = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/api/providerProfile/me"
//       );

//       setProvider(res.data);

//       setForm({
//         serviceType: res.data.serviceType || "",
//         address: res.data.address || "",
//         timeSlots: res.data.timeSlots?.join(",") || "",
//       });

//     } catch (err) {
//       console.log(err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   // ================= HANDLE =================
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ================= UPDATE =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();

//     formData.append("serviceType", form.serviceType);
//     formData.append("address", form.address);
//     formData.append("timeSlots", JSON.stringify(form.timeSlots.split(",")));

//     if (idProof) formData.append("idProof", idProof);
//     if (photoproof) formData.append("photoproof", photoproof);

//     try {
//       const res = await axios.put(
//         "http://localhost:3000/api/providerProfile/update",
//         formData
//       );

//       setProvider(res.data.provider);
//       alert("Profile updated successfully");

//     } catch (err) {
//       console.log(err.response?.data || err.message);
//     }
//   };

//   if (!provider)
//     return (
//       <div className="flex justify-center items-center h-screen text-lg">
//         Loading...
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

//       {/* HEADER */}
//       <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-6 shadow-lg mb-6 flex items-center gap-5">

//         <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold shadow-md">
//           {provider.username?.charAt(0).toUpperCase()}
//         </div>

//         <div>
//           <h1 className="text-2xl font-bold capitalize">
//             {provider.username}
//           </h1>
//           <p className="text-sm opacity-90">{provider.email}</p>
//           <span className="text-xs bg-white/20 px-3 py-1 rounded-full capitalize">
//             {provider.role}
//           </span>
//         </div>

//       </div>

//       {/* MAIN GRID */}
//       <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

//         {/* ================= VIEW ================= */}
//         <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition space-y-4">

//           <h2 className="text-lg font-semibold text-gray-700">
//             📌 Provider Details
//           </h2>

//           <p><span className="font-medium">Status:</span> {provider.verificationStatus}</p>
//           <p><span className="font-medium">Service:</span> {provider.serviceType}</p>
//           <p><span className="font-medium">Address:</span> {provider.address}</p>

//           {/* TIME SLOTS */}
//           <div>
//             <p className="font-medium mb-2">Available Slots:</p>
//             <div className="flex flex-wrap gap-2">
//               {provider.timeSlots?.map((slot, i) => (
//                 <span
//                   key={i}
//                   className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-sm"
//                 >
//                   {slot}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* ID PROOF */}
//           <div>
//             <p className="font-medium mb-1">ID Proof</p>
//             <img
//               src={provider.documents?.idProof}
//               className="w-40 rounded-lg shadow"
//             />
//           </div>

//           {/* PHOTO PROOF */}
//           <div>
//             <p className="font-medium mb-1">Photo Proof</p>
//             <img
//               src={provider.documents?.photoproof}
//               className="w-40 rounded-lg shadow"
//             />
//           </div>

//         </div>

//         {/* ================= EDIT ================= */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition space-y-4"
//         >

//           <h2 className="text-lg font-semibold text-gray-700">
//             ✏️ Edit Profile
//           </h2>

//           <input
//             name="serviceType"
//             value={form.serviceType}
//             onChange={handleChange}
//             placeholder="Service Type"
//             className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
//           />

//           <input
//             name="address"
//             value={form.address}
//             onChange={handleChange}
//             placeholder="Address"
//             className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
//           />

//           <input
//             name="timeSlots"
//             value={form.timeSlots}
//             onChange={handleChange}
//             placeholder="Time Slots (comma separated)"
//             className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
//           />

//           {/* FILES */}
//           <div>
//             <p className="text-sm mb-1">ID Proof</p>
//             <input type="file" onChange={(e) => setIdProof(e.target.files[0])} />
//           </div>

//           <div>
//             <p className="text-sm mb-1">Photo Proof</p>
//             <input type="file" onChange={(e) => setPhotoproof(e.target.files[0])} />
//           </div>

//           <button
//             className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
//           >
//             Update Profile
//           </button>

//         </form>

//       </div>
//     </div>
//   );
// };

// export { ProviderProfile };

















// CHANGED COLOR THIM






import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const ProviderProfile = () => {
  const [provider, setProvider] = useState(null);

  const [form, setForm] = useState({
    serviceType: "",
    address: "",
    timeSlots: "",
  });

  const [idProof, setIdProof] = useState(null);
  const [photoproof, setPhotoproof] = useState(null);

  // ================= FETCH =================
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/providerProfile/me"
      );

      setProvider(res.data);

      setForm({
        serviceType: res.data.serviceType || "",
        address: res.data.address || "",
        timeSlots: res.data.timeSlots?.join(",") || "",
      });

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= HANDLE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("serviceType", form.serviceType);
    formData.append("address", form.address);
    formData.append("timeSlots", JSON.stringify(form.timeSlots.split(",")));

    if (idProof) formData.append("idProof", idProof);
    if (photoproof) formData.append("photoproof", photoproof);

    try {
      const res = await axios.put(
        "http://localhost:3000/api/providerProfile/update",
        formData
      );

      setProvider(res.data.provider);
      alert("Profile updated successfully");

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  if (!provider)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-white bg-[#070A1A]">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#070A1A] text-white p-6 relative">

      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-indigo-600/20 blur-[140px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[140px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* HEADER */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg mb-6 flex items-center gap-5 relative z-10">

        <div className="w-20 h-20 rounded-full bg-white text-indigo-600 flex items-center justify-center text-3xl font-bold shadow-md">
          {provider.username?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1 className="text-2xl font-bold capitalize">
            {provider.username}
          </h1>
          <p className="text-sm opacity-90">{provider.email}</p>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full capitalize">
            {provider.role}
          </span>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 relative z-10">

        {/* VIEW */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-md space-y-4">

          <h2 className="text-lg font-semibold text-gray-200">
            📌 Provider Details
          </h2>

          <p><span className="font-medium">Status:</span> {provider.verificationStatus}</p>
          <p><span className="font-medium">Service:</span> {provider.serviceType}</p>
          <p><span className="font-medium">Address:</span> {provider.address}</p>

          <div>
            <p className="font-medium mb-2">Available Slots:</p>
            <div className="flex flex-wrap gap-2">
              {provider.timeSlots?.map((slot, i) => (
                <span
                  key={i}
                  className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-lg text-sm"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* EDIT */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-md space-y-4"
        >

          <h2 className="text-lg font-semibold text-gray-200">
            ✏️ Edit Profile
          </h2>

          <input
            name="serviceType"
            value={form.serviceType}
            onChange={handleChange}
            placeholder="Service Type"
            className="bg-white/10 border border-white/10 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-400"
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="bg-white/10 border border-white/10 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-400"
          />

          <input
            name="timeSlots"
            value={form.timeSlots}
            onChange={handleChange}
            placeholder="Time Slots (comma separated)"
            className="bg-white/10 border border-white/10 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-400"
          />

          {/* ===== MODERN FILE UPLOAD ===== */}

          {/* ID PROOF */}
          <div>
            <p className="text-sm mb-2 text-gray-300">ID Proof</p>

            <label className="flex items-center justify-between bg-white/10 border border-white/10 px-4 py-3 rounded-lg cursor-pointer hover:bg-white/20 transition">
              <span className="text-sm text-gray-300">
                {idProof ? idProof.name : "Choose ID file"}
              </span>

              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 rounded text-xs">
                Upload
              </span>

              <input
                type="file"
                className="hidden"
                onChange={(e) => setIdProof(e.target.files[0])}
              />
            </label>
          </div>

          {/* PHOTO PROOF */}
          <div>
            <p className="text-sm mb-2 text-gray-300">Photo Proof</p>

            <label className="flex items-center justify-between bg-white/10 border border-white/10 px-4 py-3 rounded-lg cursor-pointer hover:bg-white/20 transition">
              <span className="text-sm text-gray-300">
                {photoproof ? photoproof.name : "Choose photo file"}
              </span>

              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 rounded text-xs">
                Upload
              </span>

              <input
                type="file"
                className="hidden"
                onChange={(e) => setPhotoproof(e.target.files[0])}
              />
            </label>
          </div>

          <button
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Update Profile
          </button>

        </form>

      </div>
    </div>
  );
};

export { ProviderProfile };