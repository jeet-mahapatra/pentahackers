

import { useEffect, useState } from "react";
import axios from "axios";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/user/appointment/list"
        );

        if (res.data.success) {
          const sorted = res.data.data.sort((a, b) => {
            const dateA = new Date(a.appointmentDate || 0);
            const dateB = new Date(b.appointmentDate || 0);
            return dateB - dateA;
          });

          setAppointments(sorted);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="p-5 text-center text-gray-400 bg-[#070A1A] min-h-screen">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="bg-[#070A1A] text-white rounded-2xl shadow-lg p-4 sm:p-5 min-h-screen">

      {/* HEADER */}
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">
        All Appointments
      </h2>

      {/* SCROLLABLE LIST */}
      <div className="max-h-[500px] overflow-y-auto pr-1 sm:pr-2 space-y-4">

        {appointments.length === 0 ? (
          <p className="text-gray-400">No appointments found</p>
        ) : (
          appointments.map((item) => (
            <div
              key={item._id}
              className="group border border-white/10 rounded-xl p-3 sm:p-4 bg-white/5 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
            >

              {/* TOP */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">

                {/* LEFT */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold group-hover:text-cyan-400 transition truncate">
                    {item.requestType}
                  </h3>

                  <p className="text-sm text-gray-400">
                    Provider: {item.serviceProvider?.name || "N/A"}
                  </p>

                  <p className="text-sm text-gray-400">
                    Date:{" "}
                    {item.appointmentDate
                      ? new Date(item.appointmentDate).toLocaleDateString()
                      : "Not set"}
                  </p>

                  <p className="text-sm text-gray-400">
                    Time: {item.appointmentTime || "Not set"}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="self-start sm:self-center">
                  <StatusBadge status={item.status} />
                </div>
              </div>

              {/* URGENT */}
              {item.isUrgent && (
                <div className="mt-2">
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                    Urgent Request
                  </span>
                </div>
              )}

              {/* ANIMATION LINE */}
              <div className="h-[2px] w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-cyan-400 to-purple-500 mt-3"></div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export { AppointmentList };

/* =========================
   STATUS BADGE COMPONENT
========================= */
const StatusBadge = ({ status }) => {
  const base =
    "px-3 py-1 text-xs rounded-full font-medium capitalize whitespace-nowrap";

  const styles = {
    new: "bg-blue-500/20 text-blue-300",
    pending: "bg-yellow-500/20 text-yellow-300",
    completed: "bg-green-500/20 text-green-300",
    cancelled: "bg-red-500/20 text-red-300",
  };

  return (
    <span className={`${base} ${styles[status] || "bg-gray-700 text-gray-300"}`}>
      {status}
    </span>
  );
};