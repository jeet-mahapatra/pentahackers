import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export const UserFindServices = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [form, setForm] = useState({
    requestType: "",
    appointmentDate: "",
    appointmentTime: "",
    isUrgent: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND}/api/providerProfile/approved`, {
          params: { search: debouncedSearch },
        });
        const sorted = res.data.providers.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        setProviders(sorted);
      } catch (err) {
        console.log("Provider fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, [debouncedSearch]);

  const handleBooking = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND}/api/appointments/create`, {
        serviceProviderId: selectedProvider._id,
        requestType: selectedProvider.serviceType,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        isUrgent: form.isUrgent,
      });
      alert("✅ Appointment booked!");
      setSelectedProvider(null);
      setForm({ requestType: "", appointmentDate: "", appointmentTime: "", isUrgent: false });
    } catch (err) {
      console.log("Booking error:", err.response?.data || err.message);
    }
  };

  const renderStars = (rating = 0) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex gap-0.5 text-[#F59E0B]">
        {"★".repeat(rounded)}
        <span className="opacity-30">{"★".repeat(5 - rounded)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#080C1C] text-white p-6 relative overflow-hidden font-sans">
      {/* ── BACKGROUND AURORA ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[600px] h-[600px] top-[-10%] left-[-10%] rounded-full bg-[#2DD4BF]/5 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[500px] h-[500px] bottom-[-10%] right-[-10%] rounded-full bg-[#F59E0B]/5 blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-[#2DD4BF] text-xs font-bold tracking-[0.3em] uppercase">Discovery</span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif italic tracking-tight mt-2">
            Find <span className="not-italic" style={{
              background: "linear-gradient(135deg, #2DD4BF 0%, #F59E0B 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Services</span>
          </h1>
        </motion.div>

        {/* SEARCH BAR */}
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ width: "100%", opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            className="max-w-2xl w-full relative"
          >
            <input
              type="text"
              placeholder="Search by name, service, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-3xl focus:outline-none focus:border-[#2DD4BF]/50 transition-all placeholder:text-white/20 shadow-2xl"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#2DD4BF] opacity-50">✦</div>
          </motion.div>
        </div>

        {/* PROVIDERS GRID */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#2DD4BF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map((p, idx) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="group bg-white/[0.02] border flex flex-col justify-evenly border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 hover:bg-white/[0.05] hover:border-[#2DD4BF]/30 transition-all duration-500 shadow-xl relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-tr from-[#2DD4BF] to-[#0EA5E9] rounded-2xl flex items-center justify-center text-[#080C1C] font-black text-xl shadow-lg">
                    {p.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-right">
                    <p className="text-[#2DD4BF] text-[10px] font-black uppercase tracking-widest">{p.serviceType}</p>
                    <div className="mt-1">{renderStars(p.avgRating)}</div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold font-serif italic mb-2 capitalize">{p.username}</h2>
                <p className="text-white/30 text-xs mb-4 truncate">{p.email}</p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3 text-sm text-white/60">
                    <span className="text-[#F59E0B] mt-1">📍</span>
                    <span className="leading-relaxed">
                      {p.address ? `${p.address.street}, ${p.address.city}` : "Location hidden"}
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Available Slots</p>
                  <div className="flex flex-wrap gap-2">
                    {p.timeSlots?.slice(0, 3).map((slot, i) => (
                      <span key={i} className="text-[10px] bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20 px-3 py-1.5 rounded-full font-bold">
                        {slot}
                      </span>
                    ))}
                    {p.timeSlots?.length > 3 && <span className="text-[10px] text-white/20 self-center">+{p.timeSlots.length - 3}</span>}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedProvider(p)}
                  className="w-full py-4 bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] font-black rounded-2xl shadow-lg shadow-[#2DD4BF]/20 uppercase tracking-widest text-xs transition-all"
                >
                  Book Now ◈
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selectedProvider && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#080C1C]/90 backdrop-blur-md z-[100] flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-[#0D1226] border border-white/10 p-8 rounded-[3rem] w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2DD4BF]/10 blur-3xl pointer-events-none" />

              <h2 className="text-3xl font-bold font-serif italic mb-6">Secure Appointment</h2>
              <p className="text-white/40 text-sm mb-8">Booking with <span className="text-white">{selectedProvider.username}</span></p>

              <div className="space-y-6 mb-10">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 ml-1">Appointment Date</label>
                  <input
                    type="date"
                    value={form.appointmentDate}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#2DD4BF]/50"
                    onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 ml-1">Preferred Time</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#2DD4BF]/50 appearance-none"
                    value={form.appointmentTime}
                    onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
                  >
                    <option value="">Select a slot</option>
                    {selectedProvider.timeSlots?.map((slot, i) => (
                      <option key={i} value={slot} className="bg-[#0D1226]">{slot}</option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-4 p-4 bg-[#FB923C]/5 border border-[#FB923C]/20 rounded-2xl cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.isUrgent}
                    onChange={(e) => setForm({ ...form, isUrgent: e.target.checked })}
                    className="w-5 h-5 accent-[#FB923C] rounded"
                  />
                  <div>
                    <p className="text-xs font-black text-[#FB923C] uppercase tracking-tighter">Urgent Priority</p>
                    <p className="text-[10px] text-[#FB923C]/50 leading-tight">Requests prioritized handling</p>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={handleBooking} className="py-4 bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] font-black rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-[#2DD4BF]/20">Confirm</button>
                <button onClick={() => setSelectedProvider(null)} className="py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};