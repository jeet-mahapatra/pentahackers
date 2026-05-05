


import { useContext, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const MyServices = () => {
  const { user, setUser } = useContext(UserContext);
  const [newSlot, setNewSlot] = useState("");
  const [loading, setLoading] = useState(false);

  const addSlot = async () => {
    if (!newSlot.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/myservice/slots/add",
        { slot: newSlot }
      );

      setUser((prev) => ({
        ...prev,
        timeSlots: res.data.data.timeSlots,
      }));

      setNewSlot("");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding slot");
    } finally {
      setLoading(false);
    }
  };

  const removeSlot = async (slot) => {
    try {
      const res = await axios.delete(
        "http://localhost:3000/api/myservice/slots/remove",
        { data: { slot } }
      );

      setUser((prev) => ({
        ...prev,
        timeSlots: res.data.data.timeSlots,
      }));
    } catch {
      alert("Error removing slot");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 h-full bg-[#070A1A] text-white">

      {/* LEFT PANEL */}
      <div className="w-full md:w-1/3 bg-slate-800 p-6 rounded-xl shadow flex flex-col h-auto md:h-[320px] border border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-white">My Services</h2>

        <p className="text-sm text-slate-400">Category</p>
        <h3 className="text-xl font-bold mb-2 text-white">
          {user.serviceType || "Not Set"}
        </h3>

        <p className="text-sm text-green-400">
          Verification:{" "}
          {user.role === "approved_provider" ? "Verified" : "Pending"}
        </p>

        <div className="mt-4 text-sm text-slate-300 space-y-2 overflow-y-auto">
          <p><strong>Name:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Address:</strong> {user.address || "Not provided"}</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 bg-slate-800 p-6 rounded-xl shadow flex flex-col h-[320px] border border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-white">Available Slots</h2>

        {/* SLOT LIST */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4">
          <AnimatePresence>
            {user.timeSlots?.map((slot) => (
              <motion.div
                key={slot}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="flex justify-between items-center bg-slate-700 p-3 rounded-lg"
              >
                <span className="text-slate-200">{slot}</span>

                <button
                  onClick={() => removeSlot(slot)}
                  className="text-red-400 hover:text-red-500"
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ADD SLOT */}
        <div className="flex gap-2 mt-auto">
          <input
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            placeholder="e.g. 10:00 AM"
            className="flex-1 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 p-2 rounded-lg outline-none"
          />

          <button
            onClick={addSlot}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 rounded-lg transition"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

    </div>
  );
};

export { MyServices };