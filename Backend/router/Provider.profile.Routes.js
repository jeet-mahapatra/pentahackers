import express from "express";
import { getProviderProfile, updateProviderProfile } from "../Controlers/Provider.Profile.js";
import { authMiddleware } from "../Middleware/Auth.Middleware.js";
import { upload } from "../Middleware/Multer.js"

const router = express.Router();

// GET PROFILE
router.get("/me", authMiddleware, getProviderProfile);

// UPDATE PROFILE
router.put(
  "/update",
  authMiddleware,
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "photoproof", maxCount: 1 },
    { name: "certification", maxCount: 1 }, // 🔥 Added certification
  ]),
  updateProviderProfile
);

export default router;