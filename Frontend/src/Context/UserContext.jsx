
// import { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // 🔔 counts from existing APIs
//   const [counts, setCounts] = useState({
//     newAppointments: 0,
//     urgentRequests: 0,
//     pending: 0,
//   });

//   const [loading, setLoading] = useState(true);

//   // ================= USER =================
//   const fetchUser = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/api/context/me", {
//         withCredentials: true,
//       });

//       setUser(res.data);
//     } catch (err) {
//       console.log(err.message);
//     }
//   };

//   // ================= COUNTS USING EXISTING APIs =================
//   const fetchCounts = async () => {
//     try {
//       const [newRes, urgentRes, pendingRes] = await Promise.all([
//         axios.get("http://localhost:3000/api/appointments/new", {
//           withCredentials: true,
//         }),

//         axios.get("http://localhost:3000/api/appointments/urgent", {
//           withCredentials: true,
//         }),

//         axios.get("http://localhost:3000/api/appointments/pending", {
//           withCredentials: true,
//         }),
//       ]);

//       setCounts({
//         newAppointments: newRes.data.appointments?.length || 0,
//         urgentRequests: urgentRes.data.appointments?.length || 0,
//         pending: pendingRes.data.appointments?.length || 0,
//       });
//     } catch (err) {
//       console.log("Counts error:", err.message);
//     }
//   };

//   useEffect(() => {
//     const init = async () => {
//       await fetchUser();
//       await fetchCounts();
//       setLoading(false);
//     };

//     init();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser, counts, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };








// import { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const UserContext = createContext();

// axios.defaults.baseURL = "http://localhost:3000";
// axios.defaults.withCredentials = true;

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const [counts, setCounts] = useState({
//     newAppointments: 0,
//     urgentRequests: 0,
//     pending: 0,
//   });

//   const [loading, setLoading] = useState(true);

//   // ================= FETCH USER =================
//   const fetchUser = async () => {
//     try {
//       const res = await axios.get("/api/context/me");
//       setUser(res.data);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         // not logged in → ignore
//         setUser(null);
//       } else {
//         console.log("User error:", err.message);
//       }
//     }
//   };

//   // ================= FETCH COUNTS =================
//   const fetchCounts = async () => {
//     if (!user) return; // 🛑 IMPORTANT

//     try {
//       const [newRes, urgentRes, pendingRes] = await Promise.all([
//         axios.get("/api/appointments/new"),
//         axios.get("/api/appointments/urgent"),
//         axios.get("/api/appointments/pending"),
//       ]);

//       setCounts({
//         newAppointments: newRes.data?.appointments?.length || 0,
//         urgentRequests: urgentRes.data?.appointments?.length || 0,
//         pending: pendingRes.data?.appointments?.length || 0,
//       });
//     } catch (err) {
//       if (err.response?.status === 401) {
//         console.log("Not authorized yet");
//         return;
//       }
//       console.log("Counts error:", err.message);
//     }
//   };

//   // ================= INIT =================
//   useEffect(() => {
//     const init = async () => {
//       const hasToken = document.cookie.includes("token");

//       if (hasToken) {
//         await fetchUser(); // ✅ only if logged in
//       }

//       setLoading(false);
//     };

//     init();
//   }, []);

//   // ================= FETCH COUNTS AFTER USER =================
//   useEffect(() => {
//     if (user) {
//       fetchCounts(); // ✅ only after user exists
//     }
//   }, [user]);

//   return (
//     <UserContext.Provider value={{ user, setUser, counts, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };











import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

axios.defaults.baseURL = "http://localhost:3000";
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