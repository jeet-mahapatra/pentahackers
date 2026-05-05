
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

axios.defaults.withCredentials = true;

const UserDashboard = () => {
  const { user } = useContext(UserContext);

  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    cancelled: 0,
    completed: 0,
    newRequests: 0,
    todayAppointments: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/user/dashboard"
        );

        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-5 text-center text-gray-400 bg-[#070A1A] min-h-screen">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 flex flex-col space-y-6 bg-[#070A1A] text-white min-h-screen">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white p-5 rounded-xl shadow-lg">
        <h2 className="text-xl md:text-2xl font-bold">
          Welcome, {user?.username || "User"}
        </h2>
        <p className="text-gray-200">Track your daily appointments</p>
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        <StatCard title="Total" value={stats.total} />
        <StatCard title="Accepted" value={stats.accepted} />
        <StatCard title="New Requests" value={stats.newRequests} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Cancelled" value={stats.cancelled} />

      </div>

      {/* 📅 TODAY APPOINTMENTS */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-xl shadow">

        <h3 className="text-lg font-bold mb-3 text-white">
          Today's Appointments
        </h3>

        <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">

          {stats.todayAppointments?.length === 0 ? (
            <p className="text-gray-400">No appointments today</p>
          ) : (
            stats.todayAppointments.map((item) => (
              <div
                key={item._id}
                className="border border-white/10 p-4 rounded-lg flex justify-between bg-white/5 hover:bg-white/10 transition"
              >

                {/* LEFT */}
                <div>

                  <p className="font-semibold text-white">
                    {item.requestType}
                  </p>

                  <p className="text-sm text-gray-400">
                    Provider: {item.serviceProvider?.name || "N/A"}
                  </p>

                  <p className="text-sm text-gray-400">
                    Time: {item.appointmentTime || "Not set"}
                  </p>

                  <p className="text-xs text-gray-500">
                    Status: {item.status}
                  </p>

                </div>

                {/* STATUS BADGE */}
                <div className="flex items-center">

                  {item.status === "new" && (
                    <span className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                      New
                    </span>
                  )}

                  {item.status === "pending" && (
                    <span className="px-3 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded-full">
                      Accepted
                    </span>
                  )}

                  {item.status === "completed" && (
                    <span className="px-3 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                      Completed
                    </span>
                  )}

                  {item.status === "cancelled" && (
                    <span className="px-3 py-1 text-xs bg-red-500/20 text-red-300 rounded-full">
                      Cancelled
                    </span>
                  )}

                </div>

              </div>
            ))
          )}

        </div>
      </div>

    </div>
  );
};

export { UserDashboard };


// 🔹 STAT CARD (ONLY COLOR CHANGED)
const StatCard = ({ title, value }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow text-center text-white">
    <p className="text-sm text-gray-400">{title}</p>
    <h2 className="text-xl font-bold">{value}</h2>
  </div>
);