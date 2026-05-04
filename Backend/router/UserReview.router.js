import express from "express";
import {getCompletedProviders} from "../Controlers/reviewController.js"
import { createReview } from "../Controlers/reviewController.js";
import { authMiddleware } from "../Middleware/Auth.Middleware.js";

const router = express.Router();

/* GET providers for review page */
router.get("/providers", authMiddleware, getCompletedProviders);

/* CREATE REVIEW */
router.post("/", authMiddleware, createReview);

export default router;