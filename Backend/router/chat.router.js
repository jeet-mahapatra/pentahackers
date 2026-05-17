import express from "express";
import {getChatHistory} from "../Controlers/chat.controller.js"
import { checkChatAccess } from "../Controlers/chat.controller.js";
import { getMyConversations } from "../Controlers/chat.controller.js";
import { authMiddleware } from "../Middleware/Auth.Middleware.js";

const router = express.Router();

// All chat routes are protected
router.use(authMiddleware);

// GET /api/chat/conversations — get all chat conversations for logged-in user
router.get("/conversations", getMyConversations);

// GET /api/chat/access/:appointmentId — check if user can chat on this appointment
router.get("/access/:appointmentId", checkChatAccess);

// GET /api/chat/history/:appointmentId — get full message history
router.get("/history/:appointmentId", getChatHistory);

export default router;