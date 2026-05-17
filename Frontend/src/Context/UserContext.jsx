import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_BACKEND;
axios.defaults.withCredentials = true;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [counts, setCounts] = useState({
    newAppointments: 0,
    urgentRequests: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);

  // ================= FETCH USER =================
  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/context/me");
      setUser(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        // ✅ NOT LOGGED IN → ignore silently
        setUser(null);
      } else {
        console.log("User error:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH COUNTS =================
  const fetchCounts = async () => {
    if (!user) return;

    try {
      const [newRes, urgentRes, pendingRes] = await Promise.all([
        axios.get("/api/appointments/new"),
        axios.get("/api/appointments/urgent"),
        axios.get("/api/appointments/pending"),
      ]);

      setCounts({
        newAppointments: newRes.data?.appointments?.length || 0,
        urgentRequests: urgentRes.data?.appointments?.length || 0,
        pending: pendingRes.data?.appointments?.length || 0,
      });
    } catch (err) {
      if (err.response?.status !== 401) {
        console.log("Counts error:", err.message);
      }
    }
  };

  // ================= INIT =================
  useEffect(() => {
    fetchUser();
  }, []);

  // ================= AFTER LOGIN =================
  useEffect(() => {
    if (user) {
      fetchCounts();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, counts, loading }}>
      {children}
    </UserContext.Provider>
  );
};