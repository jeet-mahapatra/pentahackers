


import { Appointment } from "../model/Appiontment.model.js";

// ================= GET URGENT (ONLY NEW) =================
export const getUrgentRequests = async (req, res) => {
  try {
    const providerId = req.user.id;

    const urgentAppointments = await Appointment.find({
      serviceProvider: providerId,
      isUrgent: true,
      status: "new", // ✅ ONLY NEW
    })
      .populate("serviceUser", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      appointments: urgentAppointments,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};