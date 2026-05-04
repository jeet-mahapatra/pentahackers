import {Appointment} from "../model/Appiontment.model.js"
import {Review} from "../model/Review.model.js"

// GET providers user completed work with
export const getCompletedProviders = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.find({
      serviceUser: userId,
      status: "completed",
    })
      .populate({
        path: "serviceProvider",
        select: "username serviceType email",
      })
      .sort({ createdAt: -1 });

    const result = [];

    for (let app of appointments) {
      if (!app.serviceProvider) continue;

      // 🔥 Check review for THIS appointment
      const existingReview = await Review.findOne({
        user: userId,
        appointment: app._id,
      });

      result.push({
        provider: {
          _id: app.serviceProvider._id,
          name:
            app.serviceProvider.username ||
            app.serviceProvider.email ||
            "Unknown Provider",
          serviceType: app.serviceProvider.serviceType || "Service",
        },

        appointment: {
          _id: app._id,
          requestType: app.requestType,
          appointmentDate: app.appointmentDate,
          appointmentTime: app.appointmentTime,
        },

        isReviewed: !!existingReview, // ⭐ IMPORTANT
      });
    }

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
/**
 * CREATE REVIEW
 */
export const createReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const { serviceProvider, appointment, rating, comment } = req.body;

    // prevent duplicate review
    const existing = await Review.findOne({
      user: userId,
      appointment,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already reviewed this appointment",
      });
    }

    const review = await Review.create({
      user: userId,
      serviceProvider,
      appointment,
      rating,
      comment,
    });

    res.json({
      success: true,
      message: "Review submitted",
      data: review,
    });
  } catch (error) {
    console.error("createReview error:", error);
    res.status(500).json({ success: false });
  }
};