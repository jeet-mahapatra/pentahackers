import express from "express";
import { check, validationResult } from "express-validator";
import ConciergeRequest from "../model/Conciergerequest.model.js";
import { authMiddleware } from "../Middleware/Auth.Middleware.js"; // your existing JWT middleware
import { adminMiddleware } from "../Middleware/Admin.Middleware.js"; // your existing admin check
import { sendNotificationEmail } from "../utils/emailService.js"; // hypothetical email utility
import { getConciergeSubmitTemplate, getConciergeUpdateTemplate } from "../utils/emailTemplates.js"; // hypothetical email templates

const router = express.Router();

// ─── POST /api/concierge ──────────────────────────────────────────────────────
// Anyone can submit (logged-in users get their info auto-filled on frontend,
// guests fill manually). No auth required so even logged-out users can reach us.
router.post(
    "/",
    [
        check("senderName", "Name is required").notEmpty().trim(),
        check("senderEmail", "Valid email is required").isEmail().normalizeEmail(),
        check("subject", "Subject is required").notEmpty().trim(),
        check("subject", "Subject max 120 chars").isLength({ max: 120 }),
        check("message", "Message is required").notEmpty().trim(),
        check("message", "Message max 1500 chars").isLength({ max: 1500 }),
        check("category").optional().isIn([
            "booking_issue", "payment_issue", "account_issue",
            "verification_query", "urgent_support", "general_inquiry",
            "report_provider", "other",
        ]),
        check("priority").optional().isIn(["low", "medium", "high", "urgent"]),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });

        try {
            const {
                senderName, senderEmail, senderPhone,
                subject, category, message, priority,
                senderRole, senderId,
            } = req.body;

            const request = await ConciergeRequest.create({
                senderName: senderName.trim(),
                senderEmail,
                senderPhone: senderPhone || null,
                senderRole: senderRole || "guest",
                senderId: senderId || null,
                subject: subject.trim(),
                category: category || "general_inquiry",
                message: message.trim(),
                priority: priority || "medium",
            });

            await sendNotificationEmail(
                request.senderEmail,
                "We've received your concierge request – EasyFind",
                getConciergeSubmitTemplate(request.senderName, request.subject, request._id)
            ).catch(err => console.error("Concierge submit email error:", err));

            return res.status(201).json({
                success: true,
                message: "Your concierge request has been submitted. We'll get back to you within 24 hours.",
                requestId: request._id,
            });
        } catch (err) {
            console.error("CONCIERGE CREATE ERROR:", err.message);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
);

// ─── GET /api/concierge ───────────────────────────────────────────────────────
// Admin only — list all requests with optional filters
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status, priority, category, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (category) filter.category = category;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [requests, total] = await Promise.all([
            ConciergeRequest.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            ConciergeRequest.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            requests,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
        });
    } catch (err) {
        console.error("CONCIERGE LIST ERROR:", err.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// ─── GET /api/concierge/stats ─────────────────────────────────────────────────
// Admin only — quick count by status for the dashboard badge
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [open, in_progress, resolved, closed, urgent] = await Promise.all([
            ConciergeRequest.countDocuments({ status: "open" }),
            ConciergeRequest.countDocuments({ status: "in_progress" }),
            ConciergeRequest.countDocuments({ status: "resolved" }),
            ConciergeRequest.countDocuments({ status: "closed" }),
            ConciergeRequest.countDocuments({ priority: "urgent", status: { $in: ["open", "in_progress"] } }),
        ]);
        return res.status(200).json({ success: true, stats: { open, in_progress, resolved, closed, urgent } });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// ─── GET /api/concierge/:id ───────────────────────────────────────────────────
// Admin only — single request detail
router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const request = await ConciergeRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: "Request not found" });
        return res.status(200).json({ success: true, request });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// ─── PATCH /api/concierge/:id ─────────────────────────────────────────────────
// Admin only — update status / add admin note / resolve
router.patch(
    "/:id",
    authMiddleware,
    adminMiddleware,
    [
        check("status").optional().isIn(["open", "in_progress", "resolved", "closed"]),
        check("adminNote").optional().isLength({ max: 1000 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });

        try {
            const { status, adminNote } = req.body;
            const update = {};

            if (status) update.status = status;
            if (adminNote !== undefined) update.adminNote = adminNote;

            if (status === "resolved" || status === "closed") {
                update.resolvedAt = new Date();
                update.resolvedBy = req.user.id; // from your authMiddleware
            }

            const request = await ConciergeRequest.findByIdAndUpdate(
                req.params.id,
                { $set: update },
                { new: true }
            );

            // Notify user of status change / admin note (non-blocking)
            if (request) {
                await sendNotificationEmail(
                    request.senderEmail,
                    `Update on your request: ${request.subject} – EasyFind`,
                    getConciergeUpdateTemplate(request.senderName, request.subject, request.status, request.adminNote)
                ).catch(err => console.error("Concierge update email error:", err));
            }

            if (!request) return res.status(404).json({ success: false, message: "Request not found" });

            return res.status(200).json({ success: true, request });
        } catch (err) {
            console.error("CONCIERGE UPDATE ERROR:", err.message);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
);

// ─── DELETE /api/concierge/:id ────────────────────────────────────────────────
// Admin only — hard delete (use carefully)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const request = await ConciergeRequest.findByIdAndDelete(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: "Request not found" });
        return res.status(200).json({ success: true, message: "Request deleted" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;