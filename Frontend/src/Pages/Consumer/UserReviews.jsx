import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export const UserReviews = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/reviews/providers");
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error("fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitReview = async () => {
    try {
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
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#080C1C] text-white p-6 relative overflow-hidden font-sans">
      {/* Aurora Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-[#2DD4BF]/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-[#F59E0B]/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="text-[#2DD4BF] text-xs font-bold tracking-[0.3em] uppercase">Feedback</span>
          <h2 className="text-4xl md:text-5xl font-bold font-serif italic tracking-tight mt-2">
            Rate Your <span className="not-italic" style={{
              background: "linear-gradient(135deg, #2DD4BF 0%, #F59E0B 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Services</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {data.length === 0 ? (
            <p className="text-white/20 italic col-span-2 text-center py-20 bg-white/5 rounded-3xl border border-white/5">
              No completed services awaiting review.
            </p>
          ) : (
            data.map((item, idx) => (
              <motion.div
                key={item.appointment._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white/[0.02] border border-white/10 backdrop-blur-3xl p-6 rounded-[2.5rem] hover:bg-white/[0.05] hover:border-[#2DD4BF]/30 transition-all duration-500 shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-serif group-hover:text-[#2DD4BF] transition-colors">{item.provider?.name}</h3>
                    <p className="text-[#2DD4BF] text-[10px] font-black uppercase tracking-widest">{item.provider?.serviceType}</p>
                  </div>
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/20">◈</div>
                </div>

                <div className="space-y-2 text-sm text-white/40 font-medium border-t border-white/5 pt-4 mt-4">
                  <p className="flex items-center gap-2"><span>🧾</span> {item.appointment?.requestType}</p>
                  <p className="flex items-center gap-2"><span>📅</span> {new Date(item.appointment?.appointmentDate).toLocaleDateString()}</p>
                  <p className="flex items-center gap-2"><span>⏰</span> {item.appointment?.appointmentTime}</p>
                </div>

                {item.isReviewed ? (
                  <button disabled className="mt-6 w-full py-3 bg-white/5 border border-white/10 text-white/20 rounded-xl cursor-not-allowed font-bold text-xs uppercase tracking-widest">
                    Already Reviewed
                  </button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(item)}
                    className="mt-6 w-full py-3 bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] font-black rounded-xl shadow-lg shadow-[#2DD4BF]/20 uppercase tracking-widest text-xs"
                  >
                    Rate Experience ⭐
                  </motion.button>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#080C1C]/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-[#0D1226] border border-white/10 w-full max-w-md p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#2DD4BF]/10 blur-3xl" />

              <h3 className="text-2xl font-bold font-serif italic mb-2 relative">Share Your Experience</h3>
              <p className="text-white/40 text-sm mb-6">Reviewing {selected.provider.name}</p>

              <div className="flex gap-3 text-3xl mb-8 justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <motion.span
                    key={s}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setRating(s)}
                    className={`cursor-pointer transition-colors ${s <= rating ? "text-[#F59E0B]" : "text-white/10"}`}
                  >
                    ★
                  </motion.span>
                ))}
              </div>

              <textarea
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#2DD4BF]/50 min-h-[120px] transition-all placeholder:text-white/20 mb-6"
                placeholder="How was the service quality?..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setSelected(null)} className="py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
                <button onClick={submitReview} className="py-4 bg-gradient-to-r from-[#2DD4BF] to-[#F59E0B] text-[#080C1C] font-black rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-[#F59E0B]/20">Submit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};