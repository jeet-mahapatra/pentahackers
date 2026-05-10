import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
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
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    },
    // ─── ADMIN PROFILE FIELDS ───
    fullName: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    bio: { type: String, default: null, maxlength: 500 },

    // ─── NEW LOCATION FIELDS ───
    address: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    pinCode: { type: String, default: null },
    timezone: { type: String, default: null }, // Helpful for global admins

    resetOTP: {
        type: String,
        default: null
    },
    resetOTPExpires: {
        type: Date,
        default: null
    },

}, { timestamps: true });

export default mongoose.model('User', UserSchema);