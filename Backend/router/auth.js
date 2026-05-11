import express from "express";
import User from "../model/User.model.js";
import Provider from "../model/Provider.model.js";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendNotificationEmail } from "../utils/emailService.js";
import { getOTPTemplate } from "../utils/emailTemplates.js";
import validator from "validator";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { upload } from "../Middleware/Multer.js";
import { authMiddleware } from "../Middleware/Auth.Middleware.js";

const router = express.Router();

// ─── Professional service types that require certification ───────────────────
const PROFESSIONAL_SERVICES = new Set([
  "Doctor", "Tutor", "Fitness Trainer", "Photographer",
  "Event Planner", "Computer Technician", "Lawyer", "Architect", "Nurse",
]);

// ─── REGISTER USER ────────────────────────────────────────────────────────────
router.post(
  "/register/user",
  [
    check("name", "Name required").notEmpty(),
    check("email", "Valid email required").isEmail(),
    check("password", "Min 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { name, email, password } = req.body;
      const username = name.trim().toLowerCase();
      const normalizedEmail = email.toLowerCase();

      const existingUser = await User.findOne({ $or: [{ username }, { email: normalizedEmail }] });
      if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email: normalizedEmail, password: hashedPassword });

      return res.status(201).json({ success: true, message: "User registered successfully", userId: user._id });
    } catch (error) {
      console.error("USER REGISTER ERROR:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ─── REGISTER PROVIDER ────────────────────────────────────────────────────────
// Accepts 3 files via multipart:
//   - idProof     : required for all
//   - photoproof  : required for all
//   - certification : required only for professional service types
router.post(
  "/register/provider",
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "photoproof", maxCount: 1 },
    { name: "certification", maxCount: 1 },
  ]),
  [
    check("name", "Name required").notEmpty(),
    check("email", "Valid email required").isEmail(),
    check("password", "Min 6 characters").isLength({ min: 6 }),
    check("phone", "Valid phone required").isMobilePhone(),
    check("serviceType", "Service type required").notEmpty(),
    check("experience", "Experience level required").notEmpty(),
    check("address", "Street address required").notEmpty(),
    check("city", "City required").notEmpty(),
    check("pincode", "Valid 6-digit pincode required").isLength({ min: 6, max: 6 }).isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { name, email, password, phone, serviceType, experience, address, city, pincode, bio } = req.body;

      const username = name.trim().toLowerCase();
      const normalizedEmail = email.toLowerCase();
      const isProfessional = PROFESSIONAL_SERVICES.has(serviceType);

      // Check duplicate
      const existing = await Provider.findOne({ $or: [{ username }, { email: normalizedEmail }] });
      if (existing) return res.status(400).json({ success: false, message: "Provider already exists" });

      // Validate files
      const idProofPath = req.files?.idProof?.[0]?.path;
      const photoProofPath = req.files?.photoproof?.[0]?.path;
      const certificationPath = req.files?.certification?.[0]?.path;

      if (!idProofPath || !photoProofPath) {
        return res.status(400).json({ success: false, message: "Government ID and photograph are required" });
      }

      if (isProfessional && !certificationPath) {
        return res.status(400).json({
          success: false,
          message: `Professional certification is required for ${serviceType} providers`,
        });
      }

      // Upload to Cloudinary
      const idProofUpload = await uploadOnCloudinary(idProofPath);
      const photoProofUpload = await uploadOnCloudinary(photoProofPath);

      if (!idProofUpload || !photoProofUpload) {
        return res.status(500).json({ success: false, message: "File upload failed" });
      }

      let certificationUpload = null;
      if (isProfessional && certificationPath) {
        certificationUpload = await uploadOnCloudinary(certificationPath);
        if (!certificationUpload) {
          return res.status(500).json({ success: false, message: "Certification upload failed" });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const provider = await Provider.create({
        username,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        role: "pending_provider",
        serviceType,
        isProfessional,
        experience,
        bio: bio || null,
        address: { street: address, city, pincode },
        documents: {
          idProof: idProofUpload.secure_url,
          photoproof: photoProofUpload.secure_url,
          certification: certificationUpload ? certificationUpload.secure_url : null,
        },
        verificationStatus: "pending",
      });

      return res.status(201).json({
        success: true,
        message: "Provider registered successfully. Your account is pending verification.",
        providerId: provider._id,
        isProfessional,
      });

    } catch (error) {
      console.error("PROVIDER REGISTER ERROR:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post(
  "/login",
  [
    check("loginIdentifier", "Username or email required").notEmpty(),
    check("password", "Password required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { loginIdentifier, password } = req.body;

      const sanitized = validator.isEmail(loginIdentifier)
        ? validator.normalizeEmail(loginIdentifier).toLowerCase()
        : loginIdentifier.toLowerCase();

      let user = await User.findOne({ $or: [{ username: sanitized }, { email: sanitized }] });
      if (!user) user = await Provider.findOne({ $or: [{ username: sanitized }, { email: sanitized }] });

      if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

      // Prevent admins from logging in through the user portal
      if (user.role === 'admin') return res.status(403).json({ success: false, message: "Please use the admin login portal." });

      if (!user.password) return res.status(500).json({ success: false, message: "Password not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: { id: user._id, username: user.username, role: user.role },
      });

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
router.post(
  "/admin-login",
  [
    check("email", "Valid admin email required").isEmail(),
    check("password", "Password required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase();

      // Only find users strictly assigned the 'admin' role
      const admin = await User.findOne({ email: normalizedEmail, role: 'admin' });

      if (!admin) return res.status(400).json({ success: false, message: "Invalid admin credentials" });

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ success: false, message: "Invalid admin credentials" });

      const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // set to true in production
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        user: { id: admin._id, username: admin.username, role: admin.role },
      });

    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
router.post(
  "/forgot-password",
  [check("email", "Please enter a valid email").isEmail().normalizeEmail({ gmail_remove_dots: false })],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ error: error.array() });

    const { email } = req.body;
    try {
      const existUser = await User.findOne({ email });
      if (!existUser) return res.status(400).json({ success: false, error: "User with this email does not exist." });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      existUser.resetOTP = otp;
      existUser.resetOTPExpires = Date.now() + 10 * 60 * 1000;
      await existUser.save();

      const htmlContent = getOTPTemplate(existUser.username, otp);
      await sendNotificationEmail(existUser.email, "Your Password Reset OTP", htmlContent);

      res.json({ success: true, msg: "OTP sent successfully to your email" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

// ─── VERIFY OTP ───────────────────────────────────────────────────────────────
router.post(
  "/verify-otp",
  [
    check("email", "Email is required").isEmail(),
    check("otp", "Enter 6 digit OTP").isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ error: error.array() });

    const { email, otp } = req.body;
    try {
      const user = await User.findOne({ email, resetOTP: otp, resetOTPExpires: { $gt: Date.now() } });
      if (!user) return res.status(400).json({ success: false, error: "Invalid or Expired OTP." });
      res.json({ success: true, msg: "OTP verified successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
router.post(
  "/reset-password",
  [
    check("email", "Email is required").isEmail(),
    check("newPassword", "Password min 6 chars").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ error: error.array() });

    const { email, newPassword } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ success: false, error: "User not found" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetOTP = null;
      user.resetOTPExpires = null;
      await user.save();

      res.json({ success: true, msg: "Password has been reset successfully." });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

router.put("/profile/update", authMiddleware, async (req, res) => {
    try {
        const { 
            fullName, phoneNumber, bio, 
            address, state, country, pinCode, timezone 
        } = req.body;

        // Fetch user and update optional fields
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    fullName,
                    phoneNumber,
                    bio,
                    address,
                    state,
                    country,
                    pinCode,
                    timezone
                }
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "Identity not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("UPDATE ERROR:", error.message);
        return res.status(500).json({ success: false, message: "Server error during update" });
    }
});

export default router;