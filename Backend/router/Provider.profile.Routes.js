import express from "express";
import { getProviderProfile } from "../Controlers/Provider.Profile.js";
import { updateProviderProfile } from "../Controlers/Provider.Profile.js";
import { authMiddleware } from "../Middleware/Auth.Middleware.js";
import {upload} from "../Middleware/Multer.js"
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
  ]),
  updateProviderProfile
);

export default router;