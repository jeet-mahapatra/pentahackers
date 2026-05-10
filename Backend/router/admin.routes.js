// routes/admin.routes.js
import express from "express";
import User from "../model/User.model.js";
import Provider from "../model/Provider.model.js";

const router = express.Router();

// ─── DASHBOARD OVERVIEW STATS ────────────────────────────────────────────────
router.get("/dashboard-stats", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const providers = await Provider.find({}, 'verificationStatus');

        const providerStats = {
            total: providers.length,
            pending: providers.filter(p => p.verificationStatus === 'pending').length,
            approved: providers.filter(p => p.verificationStatus === 'approved').length,
            suspended: providers.filter(p => p.verificationStatus === 'suspended').length,
            scheduledForDeletion: providers.filter(p => p.verificationStatus === 'schedule_for_deletion').length,
        };

        res.status(200).json({ success: true, totalUsers, providerStats });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ─── PROVIDERS MANAGEMENT ────────────────────────────────────────────────────
router.get("/providers", async (req, res) => {
    try {
        const providers = await Provider.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, providers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.patch("/providers/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['approved', 'rejected', 'suspended', 'schedule_for_deletion', 'pending'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const provider = await Provider.findById(req.params.id);
        if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });

        provider.verificationStatus = status;

        if (status === 'schedule_for_deletion') {
            provider.deletionDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        } else {
            provider.deletionDate = null;
        }

        if (status === 'approved') provider.role = 'approved_provider';
        if (status === 'rejected' || status === 'suspended' || status === 'schedule_for_deletion') {
            provider.role = 'pending_provider';
        }

        await provider.save();
        res.status(200).json({ success: true, message: `Provider status updated to ${status}`, provider });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ─── USERS MANAGEMENT ────────────────────────────────────────────────────────
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.patch("/users/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'suspended'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.status = status;
        await user.save();
        res.status(200).json({ success: true, message: `User status updated to ${status}`, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ─── ADMIN PROFILE MANAGEMENT ─────────────────────────────────────────────
router.get("/profile/:id", async (req, res) => {
    try {
        const admin = await User.findById(req.params.id).select("-password");
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
        res.status(200).json({ success: true, admin });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.patch("/profile/:id", async (req, res) => {
    try {
        const { 
            fullName, phoneNumber, bio, username, email, 
            address, state, country, pinCode, timezone 
        } = req.body;
        
        const admin = await User.findById(req.params.id);
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

        // Basic Info
        if (fullName !== undefined) admin.fullName = fullName;
        if (phoneNumber !== undefined) admin.phoneNumber = phoneNumber;
        if (bio !== undefined) admin.bio = bio;
        if (username) admin.username = username.toLowerCase();
        if (email) admin.email = email.toLowerCase();

        // 🟢 NEW: Location Info
        if (address !== undefined) admin.address = address;
        if (state !== undefined) admin.state = state;
        if (country !== undefined) admin.country = country;
        if (pinCode !== undefined) admin.pinCode = pinCode;
        if (timezone !== undefined) admin.timezone = timezone;

        await admin.save();
        res.status(200).json({ success: true, message: "Profile updated successfully", admin });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ success: false, message: "Server Error (Ensure username/email are unique)" });
    }
});

export default router;