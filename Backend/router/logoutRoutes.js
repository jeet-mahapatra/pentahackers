// routes/authRoutes.js

import express from "express";
import { logoutUser } from "../Controlers/LogoutControler.js";

const router = express.Router();

router.post("/logout", logoutUser);

export default router;


// /api/auth/logout