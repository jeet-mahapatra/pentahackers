import { Appointment } from "../model/Appiontment.model.js";

export const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 📅 TODAY DATE RANGE
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const dateFilter = {
      serviceUser: userId,
      appointmentDate: { $gte: start, $lte: end },
    };

    const baseFilter = {
      serviceUser: userId,
    };

    // 📊 STATS
    const total = await Appointment.countDocuments(baseFilter);

    const accepted = await Appointment.countDocuments({
      ...baseFilter,
      status: "pending",
    });

    const cancelled = await Appointment.countDocuments({
      ...baseFilter,
      status: "cancelled",
    });

    const completed = await Appointment.countDocuments({
      ...baseFilter,
      status: "completed",
    });

    const newRequests = await Appointment.countDocuments({
      ...baseFilter,
      status: "new",
    });

    // 📅 TODAY'S APPOINTMENTS LIST (ALL STATUSES)
    const todayAppointments = await Appointment.find(dateFilter)
      .populate("serviceProvider", "name serviceType")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        total,
        accepted,
        cancelled,
        completed,
        newRequests,
        todayAppointments,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ success: false });
  }
};









export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.find({
      serviceUser: userId,
    })
      .populate("serviceProvider", "name serviceType")
      .sort({
        appointmentDate: -1,
        appointmentTime: -1,
      });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Fetch Appointments Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};