import { Router } from "express";
import {getApprovedProviders} from "../Controlers/GetApprovedProvidors.js"
import { authMiddleware } from "../Middleware/Auth.Middleware.js";
const router=Router()

router.get("/approved", authMiddleware, getApprovedProviders);



export default router


"/api/providerProfile/approved"