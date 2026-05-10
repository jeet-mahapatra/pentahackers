import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // 🟢 ADDED
import "react-toastify/dist/ReactToastify.css"; // 🟢 ADDED CSS

import { Landing } from "./Landing.jsx";
import { Login } from "./Pages/Auth/Login.jsx";

import { UserRegister } from "./Pages/Auth/UserRegister.jsx";
import { ProviderRegister } from "./Pages/Auth/ProviderRegister.jsx";

import { ProviderLayout } from "./Pages/Provider/ProviderLayout.jsx";
import { Dashboard } from "./Pages/Provider/Dashboard.jsx";
import { Appointments } from "./Pages/Provider/Appointments.jsx";
import { UrgentRequests } from "./Pages/Provider/UrgentRequests.jsx";

import { MyServices } from "./Pages/Provider/Services.jsx";
import { ProviderProfile } from "./Pages/Provider/Profile.jsx";



// USER IMPORTS

import { UserDashboard } from "./Pages/Consumer/UserDashboard.jsx"
import { UserLayout } from "./Pages/Consumer/UserLayout.jsx"
import { AppointmentList } from "./Pages/Consumer/UserAppointments.jsx"
import { UserProfile } from "./Pages/Consumer/UserProfile.jsx"
import { UserFindServices } from "./Pages/Consumer/UserFindServices.jsx"
import { UserReviews } from "./Pages/Consumer/UserReviews.jsx"

// ADMIN IMPORTS
import { AdminDashboard } from "./Pages/Admin/AdminDashboard.jsx";
import { AdminLogin } from "./Pages/Auth/AdminLogin.jsx";


// CHAT
import ChatPage from "./Pages/ChatPage.jsx";
import Support from "./Pages/Consumer/Support.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* 🟢 CONFIGURED GLOBAL TOAST CONTAINER */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Routes>
        {/* 🌐 PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 🔥 REGISTER ROUTES */}
        <Route path="/register/user" element={<UserRegister />} />
        <Route path="/register/provider" element={<ProviderRegister />} />
        <Route path="/register" element={<Navigate to="/register/user" />} />

        {/* 👑 ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* 🧑‍🔧 PROVIDER ROUTES */}
        <Route path="/provider" element={<ProviderLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="urgent" element={<UrgentRequests />} />
          <Route path="services" element={<MyServices />} />
          <Route path="profile" element={<ProviderProfile />} />
          <Route path="chats" element={<ChatPage />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* 👤 USER ROUTES */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="findservices" element={<UserFindServices />} />
          <Route path="bookings" element={<AppointmentList />} />
          <Route path="reviews" element={<UserReviews />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="chats" element={<ChatPage />} />
          <Route path="support" element={<Support />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;












