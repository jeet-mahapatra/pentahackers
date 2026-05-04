import { Router } from "express";
import { getMe } from "../Controlers/UserContext.profile.js";
import { authMiddleware } from "../Middleware/Auth.Middleware.js";
const router=Router()

router.get("/me", authMiddleware, getMe);



export default router


// /api/context/me