import mongoose, { Schema } from "mongoose";

const ConciergeRequestSchema = new Schema(
    {
        // Who submitted
        senderName: {
            type: String,
            required: true,
            trim: true,
        },
        senderEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        senderPhone: {
            type: String,
            default: null,
        },
        // The role of the person contacting (auto-filled from JWT or guest)
        senderRole: {
            type: String,
            enum: ["user", "approved_provider", "pending_provider", "guest"],
            default: "guest",
        },
        // Reference to User or Provider doc (optional — only if logged in)
        senderId: {
            type: Schema.Types.ObjectId,
            default: null,
        },

        // Request details
        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        category: {
            type: String,
            enum: [
                "booking_issue",
                "payment_issue",
                "account_issue",
                "verification_query",
                "urgent_support",
                "general_inquiry",
                "report_provider",
                "other",
            ],
            default: "general_inquiry",
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1500,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },

        // Admin response
        status: {
            type: String,
            enum: ["open", "in_progress", "resolved", "closed"],
            default: "open",
        },
        adminNote: {
            type: String,
            default: null,
            maxlength: 1000,
        },
        resolvedAt: {
            type: Date,
            default: null,
        },
        resolvedBy: {
            type: Schema.Types.ObjectId, // Admin user id
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model("ConciergeRequest", ConciergeRequestSchema);