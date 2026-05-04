import express from "express";
import {getUserDashboardStats} from "../Controlers/UserAppointment.Controler.js"
import { authMiddleware } from "../Middleware/Auth.Middleware.js";
import {getUserAppointments} from "../Controlers/UserAppointment.Controler.js"
const router = express.Router();

// USER DASHBOARD DATA
router.get("/dashboard", authMiddleware, getUserDashboardStats);

/* 📅 ALL APPOINTMENTS LIST */
router.get("/appointment/list", authMiddleware, getUserAppointments);

// /api/user/dashboard
// /api/user/appointment/list

export default router;