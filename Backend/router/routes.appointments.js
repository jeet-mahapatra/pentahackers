import { Router } from "express";
const router =Router();
import { CreateAppointment } from "../Controlers/ProvidorAppiontmentControler.js";
import { getAppointmentStats } from "../Controlers/ProvidorAppiontmentControler.js";
import { authMiddleware } from "../Middleware/Auth.Middleware.js";

import { getPendingAppointments } from "../Controlers/ProvidorAppiontmentControler.js";

import { markAppointmentCompleted } from "../Controlers/ProvidorAppiontmentControler.js";
import { getNewAppointments } from "../Controlers/ProvidorAppiontmentControler.js";
import { acceptAppointment } from "../Controlers/ProvidorAppiontmentControler.js";

import { cancelAppointment } from "../Controlers/ProvidorAppiontmentControler.js";
import {getUrgentRequests} from "../Controlers/UrjentRequest.Controler.js"

console.log("Appointment routes loaded");

// CREATE THE APPOINTMENT AND GETTING APPOINTMENT STATUS FOR DASHBORD

router.post("/create",authMiddleware,CreateAppointment)
router.get("/stats",authMiddleware, getAppointmentStats);

// GETING PENDING APPOINTMENTS WITH DETAILS FOR DASHBORD

router.get("/pending", authMiddleware, getPendingAppointments);

// router fro making the new appointment pending

router.patch("/complete/:id", authMiddleware, markAppointmentCompleted);

//  GET NEW APPOINTMENTS (dashboard cards)
router.get("/new", authMiddleware, getNewAppointments);

// SENDS URJENT APPOINTMENTS ONLY

router.get("/urgent", authMiddleware, getUrgentRequests);


//  ACCEPT (NEW → PENDING)
router.patch("/accept/:id", authMiddleware, acceptAppointment);

//  CANCEL (NEW → CANCELLED)
router.patch("/cancel/:id", authMiddleware, cancelAppointment);

router.get("/test", (req, res) => {
  res.send("Route working");
});
export default router
// authMiddleware,

