// import express from 'express';
// import 'dotenv/config';
// import cors from "cors"; 
// import cookieParser from "cookie-parser";
// import connectToMongo from './config/db.js';
// import authRouter from './router/auth.js';
// import appointmentRoutes from "./router/routes.appointments.js"
// import profileContext from "./router/ProfileContextApi.router.js"
// import ProviderMyService from "./router/Provider.service.Router.js"
// import ProviderProfile from "./router/Provider.profile.Routes.js"
// import VerifyedProvidorForRequest from "./router/UserApprovedProviderRequest.Routers.js"
// import reviewRoutes from "./router/UserReview.router.js"


// // USER DASHDORD 

// import UserDashboardDetails from "./router/UserAppointment.Router.js"




// // connect mongodb

// connectToMongo();

// const app = express();
// app.use(express.json({limit:"30kb"}))
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));
// app.use(cookieParser());

// const PORT = process.env.PORT ;

// app.use('/api/auth', authRouter);

// app.use("/api/appointments",appointmentRoutes)

// app.use("/api/context", profileContext);

// app.use("/api/myservice", ProviderMyService);

// app.use("/api/providerProfile",ProviderProfile)

// app.use("/api/providerProfile",VerifyedProvidorForRequest)

// app.use("/api/user",UserDashboardDetails)

// app.use("/api/reviews", reviewRoutes);




// app.get('/', (req, res)=>{
//     res.send("Hello World.");
// })



// app.listen(PORT,()=>{
//     console.log(`Example app listening on port ${PORT}`);
// })
















import express from 'express';
import 'dotenv/config';
import cors from "cors"; 
import cookieParser from "cookie-parser";
import connectToMongo from './config/db.js';
import authRouter from './router/auth.js';
import appointmentRoutes from "./router/routes.appointments.js"
import profileContext from "./router/ProfileContextApi.router.js"
import ProviderMyService from "./router/Provider.service.Router.js"
import ProviderProfile from "./router/Provider.profile.Routes.js"
import VerifyedProvidorForRequest from "./router/UserApprovedProviderRequest.Routers.js"
import reviewRoutes from "./router/UserReview.router.js"

// USER DASHDORD 
import UserDashboardDetails from "./router/UserAppointment.Router.js"

// ── NEW: Chat imports ──────────────────────────────────────────
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Message } from "./model/Message.model.js";
import {Appointment} from "./model/Appiontment.model.js"
import chatRouter from "./router/chat.router.js";
// ──────────────────────────────────────────────────────────────

// connect mongodb
connectToMongo();

const app = express();
app.use(express.json({limit:"30kb"}))
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());

const PORT = process.env.PORT ;

app.use('/api/auth', authRouter);
app.use("/api/appointments",appointmentRoutes)
app.use("/api/context", profileContext);
app.use("/api/myservice", ProviderMyService);
app.use("/api/providerProfile",ProviderProfile)
app.use("/api/providerProfile",VerifyedProvidorForRequest)
app.use("/api/user",UserDashboardDetails)
app.use("/api/reviews", reviewRoutes);

// ── NEW: Chat REST routes ──────────────────────────────────────
app.use("/api/chat", chatRouter);
// ──────────────────────────────────────────────────────────────

app.get('/', (req, res)=>{
    res.send("Hello World.");
})

// ── NEW: HTTP server + Socket.io setup ────────────────────────
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Socket.io auth middleware — reads JWT from cookie or handshake auth
io.use((socket, next) => {
  try {
    // Try cookie first (sent via withCredentials)
    let token = socket.handshake.headers?.cookie
      ?.split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    // Fallback: auth object from client
    if (!token && socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
    }

    if (!token) {
      return next(new Error("Authentication error: No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    socket.user = decoded; // { id, role }
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id} | User: ${socket.user.id} | Role: ${socket.user.role}`);

  // ── JOIN ROOM ────────────────────────────────────────────────
  // Client emits join_room with appointmentId
  socket.on("join_room", async ({ appointmentId }) => {
  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return socket.emit("error", { message: "Appointment not found" });
    }

    // ✅ FIXED: allow pending + completed
    const allowedStatuses = ["pending", "completed"];

    if (!allowedStatuses.includes(appointment.status)) {
      return socket.emit("error", {
        message: "Chat not allowed for this appointment",
      });
    }

    const userId = socket.user.id;
    const userRole = socket.user.role;

    const isUser =
      userRole === "user" &&
      appointment.serviceUser.toString() === userId.toString();

    const isProvider =
      (userRole === "approved_provider" ||
        userRole === "pending_provider") &&
      appointment.serviceProvider.toString() === userId.toString();

    if (!isUser && !isProvider) {
      return socket.emit("error", {
        message: "Not authorized for this chat room",
      });
    }

    socket.join(appointmentId);
    socket.emit("joined_room", { appointmentId });
  } catch (err) {
    socket.emit("error", { message: "Failed to join room" });
  }
});

  socket.on("send_message", async ({ appointmentId, message }) => {
  try {
    if (!message || !message.trim()) return;

    const appointment = await Appointment.findById(appointmentId);

    // ✅ FIXED: allow pending + completed
    const allowedStatuses = ["pending", "completed"];

    if (!appointment || !allowedStatuses.includes(appointment.status)) {
      return socket.emit("error", { message: "Chat not allowed" });
    }

    const senderId = socket.user.id;
    const senderRole = socket.user.role;

    const isUser = senderRole === "user";
    const senderType = isUser ? "user" : "provider";

    const receiverId = isUser
      ? appointment.serviceProvider
      : appointment.serviceUser;

    const receiverType = isUser ? "provider" : "user";

    const validSender = isUser
      ? appointment.serviceUser.toString() === senderId.toString()
      : appointment.serviceProvider.toString() === senderId.toString();

    if (!validSender) {
      return socket.emit("error", { message: "Not authorized" });
    }

    const newMessage = await Message.create({
      appointmentId,
      senderId,
      senderType,
      receiverId,
      receiverType,
      message: message.trim(),
    });

    io.to(appointmentId).emit("receive_message", {
      _id: newMessage._id,
      appointmentId,
      senderId,
      senderType,
      receiverId,
      receiverType,
      message: newMessage.message,
      isRead: newMessage.isRead,
      createdAt: newMessage.createdAt,
    });
  } catch (err) {
    socket.emit("error", { message: "Failed to send message" });
  }
});

  // ── TYPING INDICATOR ─────────────────────────────────────────
  socket.on("typing", ({ appointmentId }) => {
    socket.to(appointmentId).emit("user_typing", {
      userId: socket.user.id,
      role: socket.user.role,
    });
  });

  socket.on("stop_typing", ({ appointmentId }) => {
    socket.to(appointmentId).emit("user_stop_typing", {
      userId: socket.user.id,
    });
  });

  // ── DISCONNECT ───────────────────────────────────────────────
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});
// ──────────────────────────────────────────────────────────────

// ── CHANGED: app.listen → httpServer.listen ───────────────────
// (Only this line changes from the original — required for socket.io)
httpServer.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});