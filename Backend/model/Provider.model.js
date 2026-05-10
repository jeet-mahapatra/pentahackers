import mongoose, { Schema } from "mongoose";

const ProviderSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['pending_provider', 'approved_provider'],
        default: 'pending_provider'
    },
    phone: {
        type: String,
        default: null
    },
    serviceType: {
        type: String,
        default: null
    },
    // Whether this provider is a credentialed professional (Doctor, Lawyer, Tutor etc.)
    isProfessional: {
        type: Boolean,
        default: false
    },
    experience: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: null,
        maxlength: 500
    },
    timeSlots: {
        type: [String],
        default: []
    },
    // Structured address
    address: {
        street: { type: String, default: null },
        city: { type: String, default: null },
        pincode: { type: String, default: null },
    },

    documents: {
        // Required for ALL providers
        idProof: {
            type: String,
            required: true,
        },
        // Required for ALL providers
        photoproof: {
            type: String,
            required: true,
        },
        // Required ONLY for professional service providers
        certification: {
            type: String,
            default: null,
        }
    },

    verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended', 'schedule_for_deletion'],
        default: 'pending'
    },
    // NEW: Used for the 7-day grace period
    deletionDate: {
        type: Date,
        default: null
    },
    resetOTP: {
        type: String,
        default: null
    },
    resetOTPExpires: {
        type: Date,
        default: null
    },

}, { timestamps: true });

// This index will automatically delete documents once the deletionDate has passed
ProviderSchema.index({ deletionDate: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Provider', ProviderSchema);