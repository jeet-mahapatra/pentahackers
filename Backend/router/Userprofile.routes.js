import express from "express";
import { getUserProfile, updateUserProfile } from "../Controlers/Userprofile.controler.js";
import { authMiddleware } from "../middleware/Auth.Middleware.js"; // ← adjust path to your auth middleware

const router = express.Router();

// GET  /api/userProfile/me      — fetch own profile
router.get("/me", authMiddleware, getUserProfile);

// PUT  /api/userProfile/update  — update own profile
router.put("/update", authMiddleware, updateUserProfile);

export default router;