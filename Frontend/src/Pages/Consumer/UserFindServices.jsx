import { useEffect, useState } from "react";
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
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/providerProfile/approved", {
          params: { search: debouncedSearch },
        });

        const sortedProviders = res.data.providers.sort(
          (a, b) => (b.avgRating || 0) - (a.avgRating || 0)
        );

        setProviders(sortedProviders);
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
      await axios.post("/api/appointments/create", {
        serviceProviderId: selectedProvider._id,
        requestType: selectedProvider.serviceType,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        isUrgent: form.isUrgent,
      });

      alert("✅ Appointment booked!");
      setSelectedProvider(null);

      setForm({
        requestType: "",
        appointmentDate: "",
        appointmentTime: "",
        isUrgent: false,
      });
    } catch (err) {
      console.log("Booking error:", err.response?.data || err.message);
    }
  };

  const renderStars = (rating = 0) => {
    const rounded = Math.round(rating);
    return (
      <>
        {"★".repeat(rounded)}
        {"☆".repeat(5 - rounded)}
      </>
    );
  };

  return (
    <div className="p-6 bg-[#070A1A] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text">
        Find Services
      </h1>

      {/* SEARCH */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by name, service, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-3 bg-white/5 border border-white/10 text-white rounded-xl backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* PROVIDERS */}
      {loading ? (
        <h2 className="text-center mt-10 text-gray-400">Loading...</h2>
      ) : providers.length === 0 ? (
        <h2 className="text-center text-gray-400 mt-10">No providers found</h2>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => {
            const avg = p.avgRating ?? 0;
            const min = p.minRating ?? 0;
            const max = p.maxRating ?? 0;
            const total = p.totalReviews ?? 0;

            return (
              <div
                key={p._id}
                className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-5 transition transform hover:-translate-y-2 hover:shadow-purple-500/20 duration-300"
              >
                <h2 className="text-xl font-semibold capitalize text-white">
                  {p.username}
                </h2>

                <p className="text-gray-400 text-wrap">{p.email}</p>

                <p className="mt-2 text-gray-300">
                  <span className="font-semibold">Service:</span> {p.serviceType}
                </p>

                {/* FIXED: Rendering address properties instead of the whole object */}
                <p className="mt-2 text-sm text-gray-400">
                  {p.address ? (
                    `${p.address.street}, ${p.address.city} - ${p.address.pincode}`
                  ) : (
                    "No address provided"
                  )}
                </p>

                {/* RATINGS */}
                <div className="mt-3 border-t border-white/10 pt-3">
                  {total > 0 ? (
                    <>
                      <div className="flex justify-between items-center">
                        <p className="text-yellow-400 font-semibold text-lg">
                          ⭐ {avg.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {total} review{total > 1 && "s"}
                        </p>
                      </div>

                      <div className="text-yellow-300 text-sm mt-1">
                        {renderStars(avg)}
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        Min: {min} | Max: {max}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">No reviews yet</p>
                  )}
                </div>

                {/* SLOTS */}
                <div className="mt-3">
                  <p className="font-semibold text-gray-300">Available Slots:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {p.timeSlots?.slice(0, 4).map((slot, i) => (
                      <span
                        key={i}
                        className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-lg text-sm"
                      >
                        {slot}
                      </span>
                    ))}
                    {p.timeSlots?.length > 4 && (
                      <span className="text-gray-400 text-sm">
                        +{p.timeSlots.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProvider(p)}
                  className="mt-4 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white py-2 rounded-xl"
                >
                  Book Appointment
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-[#0B0F2A] border border-white/10 p-6 rounded-2xl w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-white">
              Book with {selectedProvider.username}
            </h2>

            <input
              type="date"
              value={form.appointmentDate}
              className="w-full mb-3 p-2 bg-white/5 border border-white/10 rounded text-white"
              onChange={(e) =>
                setForm({ ...form, appointmentDate: e.target.value })
              }
            />

            <select
              className="w-full mb-3 p-2 bg-white/5 border border-white/10 rounded text-white"
              value={form.appointmentTime}
              onChange={(e) =>
                setForm({ ...form, appointmentTime: e.target.value })
              }
            >
              <option value="">Select Time Slot</option>
              {selectedProvider.timeSlots?.map((slot, i) => (
                <option key={i} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 mb-3 text-gray-300">
              <input
                type="checkbox"
                checked={form.isUrgent}
                onChange={(e) =>
                  setForm({ ...form, isUrgent: e.target.checked })
                }
              />
              Mark as Urgent
            </label>

            <div className="flex justify-between">
              <button
                onClick={handleBooking}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
              <button
                onClick={() => setSelectedProvider(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};