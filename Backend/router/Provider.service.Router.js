import express from "express";
import { addTimeSlot } from "../Controlers/ProviderService.Controler.js";
import { removeTimeSlot } from "../Controlers/ProviderService.Controler.js";
import { authMiddleware } from "../Middleware/Auth.Middleware.js";

const router = express.Router();

router.post("/slots/add", authMiddleware, addTimeSlot);
router.delete("/slots/remove", authMiddleware, removeTimeSlot);

export default router;