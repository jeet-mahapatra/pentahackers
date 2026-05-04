
import {Appointment} from "../model/Appiontment.model.js"
import Provider from "../model/Provider.model.js";
import User from "../model/User.model.js";


// ==========================
// CREATE APPOINTMENT
// ==========================
const CreateAppointment = async (req, res) => {
  try {
    const {
      serviceProviderId,
      requestType,
      isUrgent,
      status,
      appointmentDate,
      appointmentTime
    } = req.body;

    const serviceUser = req.user?.id;

    if (!serviceUser) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (!serviceProviderId || !requestType || !appointmentDate) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    const appointment = await Appointment.create({
      serviceUser,
      serviceProvider: serviceProviderId,
      requestType,
      isUrgent,
      appointmentDate,
      appointmentTime,
      status: status || "new",
    });

    return res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// ==========================
// APPOINTMENT STATS
// ==========================
const getAppointmentStats = async (req, res) => {
  try {
    const providerId = req.user.id;

    const provider = await User.findById(providerId).select("username");

    const totalRequests = await Appointment.countDocuments({
      serviceProvider: providerId,
    });

    const totalNew = await Appointment.countDocuments({
      serviceProvider: providerId,
      status: "new",
    });

    const completed = await Appointment.countDocuments({
      serviceProvider: providerId,
      status: "completed",
    });

    const pending = await Appointment.countDocuments({
      serviceProvider: providerId,
      status: "pending",
    });

    // ✅ NEW: cancelled count
    const cancelled = await Appointment.countDocuments({
      serviceProvider: providerId,
      status: "cancelled",
    });

    return res.json({
      providerName: provider?.username || "Unknown",
      totalRequests,
      totalNew,
      completed,
      pending,
      cancelled, // ✅ added here
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// ==========================
// GET PENDING APPOINTMENTS
// ==========================
const getPendingAppointments = async (req, res) => {
  try {
    const providerId = req.user.id;

    const data = await Appointment.find({
      serviceProvider: providerId,
      status: "pending",
    })
      .populate("serviceUser", "username")
      .populate("serviceProvider", "username");

    return res.json({
      success: true,
      appointments: data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// ==========================
// MARK AS COMPLETED
// ==========================
const markAppointmentCompleted = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "completed" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Appointment not found",
        receivedId: appointmentId,
      });
    }

    return res.json({
      success: true,
      message: "Updated successfully",
      appointment: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// ==========================
// GET NEW APPOINTMENTS
// ==========================
// const getNewAppointments = async (req, res) => {
//   try {
//     const providerId = req.user.id;

//     const appointments = await Appointment.find({
//       serviceProvider: providerId,
//       status: "new",
//     })
//       .populate("serviceUser", "username email")
//       .populate("serviceProvider", "username email")
//       .sort({ createdAt: -1 });

//     return res.json({
//       success: true,
//       total: appointments.length,
//       appointments,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// };


const getNewAppointments = async (req, res) => {
  try {
    const providerId = req.user.id;

    const appointments = await Appointment.find({
      serviceProvider: providerId,
      status: "new",
      isUrgent: false, // ✅ only NON-URGENT
    })
      .populate("serviceUser", "username email")
      .populate("serviceProvider", "username email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: appointments.length,
      appointments,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ==========================
// ACCEPT APPOINTMENT
// ==========================
const acceptAppointment = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      _id: id,
      serviceProvider: providerId,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status !== "new") {
      return res.status(400).json({
        message: "Only NEW appointments can be accepted",
      });
    }

    appointment.status = "pending";
    await appointment.save();

    return res.json({
      message: "Appointment accepted successfully",
      appointment,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// ==========================
// CANCEL APPOINTMENT
// ==========================
const cancelAppointment = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      _id: id,
      serviceProvider: providerId,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status !== "new") {
      return res.status(400).json({
        message: "Only NEW appointments can be cancelled",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    return res.json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// ==========================
// EXPORT ALL
// ==========================
export {
  CreateAppointment,
  getAppointmentStats,
  getPendingAppointments,
  markAppointmentCompleted,
  getNewAppointments,
  acceptAppointment,
  cancelAppointment,
};