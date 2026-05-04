import { Message } from "../model/Message.model.js";
import {Appointment} from "../model/Appiontment.model.js"

// Helper: verify the requester is a participant of this appointment
// readOnly = true  -> allows pending + completed (view history)
// readOnly = false -> allows pending only (send new messages)
const verifyChatAccess = async (
  appointmentId,
  requesterId,
  requesterRole,
  readOnly = false
) => {
  const appointment = await Appointment.findById(appointmentId);
 
  if (!appointment) {
    return { allowed: false, message: "Appointment not found" };
  }
 
  const allowedStatuses = readOnly ? ["pending", "completed"] : ["pending"];
 
  if (!allowedStatuses.includes(appointment.status)) {
    return {
      allowed: false,
      message: readOnly
        ? "No chat history found for this appointment"
        : "Chat is only available for active (accepted) appointments",
    };
  }
 
  const isUser =
    requesterRole === "user" &&
    appointment.serviceUser.toString() === requesterId.toString();
 
  const isProvider =
    (requesterRole === "approved_provider" ||
      requesterRole === "pending_provider") &&
    appointment.serviceProvider.toString() === requesterId.toString();
 
  if (!isUser && !isProvider) {
    return { allowed: false, message: "You are not part of this appointment" };
  }
 
  return { allowed: true, appointment };
};
 
// GET /api/chat/history/:appointmentId
// readOnly access - works for both pending and completed appointments
export const getChatHistory = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { id: requesterId, role: requesterRole } = req.user;
 
    const { allowed, message } = await verifyChatAccess(
      appointmentId,
      requesterId,
      requesterRole,
      true // readOnly = true, allows completed appointments
    );
 
    if (!allowed) {
      return res.status(403).json({ success: false, message });
    }
 
    const messages = await Message.find({ appointmentId }).sort({ createdAt: 1 });
 
    // Mark unread messages as read for this user
    await Message.updateMany(
      { appointmentId, receiverId: requesterId, isRead: false },
      { isRead: true }
    );
 
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("GET CHAT HISTORY ERROR:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
// GET /api/chat/access/:appointmentId
// Used by frontend before opening chat - also readOnly so history is accessible
export const checkChatAccess = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { id: requesterId, role: requesterRole } = req.user;

    const { allowed, message, appointment } = await verifyChatAccess(
      appointmentId,
      requesterId,
      requesterRole,
      true
    );

    if (!allowed) {
      return res.status(403).json({ success: false, message });
    }

    // ✅ FIXED: allow chat for pending + completed
    const canSendMessage =
      appointment.status === "pending" ||
      appointment.status === "completed";

    return res.status(200).json({
      success: true,
      allowed: true,
      canSendMessage, // 🔥 FIXED
      appointment: {
        id: appointment._id,
        status: appointment.status,
        serviceUser: appointment.serviceUser,
        serviceProvider: appointment.serviceProvider,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};
 
// GET /api/chat/conversations
// Returns ONE entry per unique other person (grouped).
export const getMyConversations = async (req, res) => {
  try {
    const { id: requesterId, role: requesterRole } = req.user;
    const isUser = requesterRole === "user";
 
    const appointments = await Appointment.find(
      isUser
        ? { serviceUser: requesterId, status: { $in: ["pending", "completed"] } }
        : { serviceProvider: requesterId, status: { $in: ["pending", "completed"] } }
    )
      .populate("serviceProvider", "username serviceType")
      .populate("serviceUser", "username");
 
    // Group by the other person's ID
    const groupedMap = new Map();
 
    for (const appt of appointments) {
      const otherPerson = isUser ? appt.serviceProvider : appt.serviceUser;
      if (!otherPerson) continue;
 
      const key = otherPerson._id.toString();
      if (!groupedMap.has(key)) {
        groupedMap.set(key, { otherPerson, appointments: [] });
      }
      groupedMap.get(key).appointments.push(appt);
    }
 
    // For each unique person, aggregate last message + unread count
    const conversations = await Promise.all(
      Array.from(groupedMap.values()).map(async ({ otherPerson, appointments: appts }) => {
        const appointmentIds = appts.map((a) => a._id);
 
        const lastMessage = await Message.findOne({
          appointmentId: { $in: appointmentIds },
        }).sort({ createdAt: -1 });
 
        const unreadCount = await Message.countDocuments({
          appointmentId: { $in: appointmentIds },
          receiverId: requesterId,
          isRead: false,
        });
 
        const latestAppointment = appts.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )[0];
 
        return {
          appointmentId: latestAppointment._id,
          allAppointmentIds: appointmentIds,
          appointmentCount: appts.length,
          pendingCount: appts.filter((a) => a.status === "pending").length,
          completedCount: appts.filter((a) => a.status === "completed").length,
          requestType: latestAppointment.requestType,
          serviceUser: latestAppointment.serviceUser,
          serviceProvider: latestAppointment.serviceProvider,
          lastMessage: lastMessage || null,
          unreadCount,
        };
      })
    );
 
    // Sort by most recent message
    conversations.sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
      const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
      return bTime - aTime;
    });
 
    return res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.error("GET CONVERSATIONS ERROR:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 