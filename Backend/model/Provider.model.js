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
    serviceType: {
        type: String,
        default: null
    },
    timeSlots: {
        type: [String],
        default: []
    },
    address: {
        type: String,
        default: null
    },

    documents: {
        idProof: {
            type: String,
            required: true,
    
        },
        photoproof: {
            type: String,
            required: true,
         
        }
    },

    verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
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

export default mongoose.model('Provider', ProviderSchema);



