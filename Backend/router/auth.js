import express from "express";
import User from "../model/User.js";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendNotificationEmail } from "../utils/emailService.js";
import { getOTPTemplate } from "../utils/emailTemplates.js";
import validator from "validator";

const router = express.Router();

const JWT_SECRET = process.env.SECRET_KEY;

// Routes 1 : Create a new user by POST "/api/auth/register"
router.post(
    "/register",
    [
        // validation
        check("username", "Please enter a valid username").notEmpty(),
        check("email", "Please enter a valid email").isEmail().normalizeEmail({ gmail_remove_dots: false }),
        check("password", "Please enter a valid password").isLength({ min: 6 }),
    ],
    async (req, res) => {
        // validationResult function checks whether any error occurs or not and return an object
        const error = validationResult(req);

        // If some error occurs, then return the error
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        let success = false;

        try {
            // Check if username OR email already exists
            const existingUser = await User.findOne({ username: req.body.username });
            const existingEmail = await User.findOne({ email: req.body.email });

            if (existingUser) {
                return res
                    .status(400)
                    .json({
                        success,
                        error: "A user with this username already exists.",
                    });
            }

            if (existingEmail) {
                return res
                    .status(400)
                    .json({ success, error: "A user with this email already exists." });
            }

            // To hash a password and store in DB
            const salt = await bcrypt.genSalt(10);
            const securePassword = await bcrypt.hash(req.body.password, salt);

            // Create new user and save data into database
            const user = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: securePassword,
            });

            // JWT payload for secure authentication
            const payload = {
                user: {
                    id: user.id,
                    role: user.role,
                },
            };

            // Produces a signed JSON Web Token
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

            res.json({
                success: true,
                authToken: token,
                role: user.role,
                username: user.username,
                userId: user.id,
                email: user.email
            });
        } catch (error) {
            console.error(error.message);
            // Added check for duplicate key error (if validation missed it)
            if (error.code === 11000) {
                return res
                    .status(400)
                    .json({ success, error: "Username or Email already in use." });
            }
            res.status(500).json({ success, error: "Internal Server Error" });
        }
    }
);

// Routes 2: Login a user by POST "/api/auth/login"
router.post(
    "/login",
    [
        // validation
        check("loginIdentifier", "Please enter a valid username or email")
            .notEmpty(),
        check("password", "Please enter a valid password").isLength({ min: 6 }),
    ],
    async (req, res) => {
        // validationResult function checks whether any error occurs or not and return an object
        const error = validationResult(req);

        // If some error occurs, then return the error
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        const { loginIdentifier, password } = req.body;
        let success = false;

        try {
            // Convert username or email to lowercase
            const sanitizedIdentifier = validator.isEmail(loginIdentifier) ? validator.normalizeEmail(loginIdentifier, { gmail_remove_dots: false }).toLowerCase() : loginIdentifier.toLowerCase();

            // Find user by either username OR email (after converting to lowercase)
            const existUser = await User.findOne({
                $or: [
                    { username: sanitizedIdentifier },
                    { email: sanitizedIdentifier },
                ],
            });

            console.log("existUser : ", existUser);
            // Check user exist or not
            if (!existUser) {
                return res.status(400).json({ success, error: "Invalid Credentials. Please try again." });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, existUser.password);

            // Check password matche or not
            if (!isMatch) {
                return res.status(400).json({ success, error: "Invalid Credentials. Please try again." });
            }

            // JWT payload for secure authentication
            const payload = {
                user: {
                    id: existUser.id,
                    role: existUser.role,
                },
            };

            // Produces a signed JSON Web Token
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

            res.json({
                success: true,
                authToken: token,
                role: existUser.role,
                username: existUser.username,
                userId: existUser.id,
                email: existUser.email
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success, error: "Internal Server Error" });
        }
    }
);

// Routes 3: Login a user by POST "/api/auth/forgot-password"
router.post(
    "/forgot-password",
    [
        // Validaton
        check("email", "Please enter a valid email").isEmail().normalizeEmail({ gmail_remove_dots: false }),
    ],
    async (req, res) => {
        const error = validationResult(req);

        // If some error occurs, then return the error
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        const { email } = req.body;

        let success = false;

        try {
            // Find user through exist email
            console.log("email : ", email);
            const existUser = await User.findOne({ email });
            console.log("existUser : ", existUser);
            // Check user exist or not
            if (!existUser) {
                return res
                    .status(400)
                    .json({ success, error: "User with this email does not exist." });
            }

            // Generate 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            // Save OTP and expiry (10 minutes) to DB
            existUser.resetOTP = otp;
            existUser.resetOTPExpires = Date.now() + 10 * 60 * 1000;
            await existUser.save();

            const htmlContent = getOTPTemplate(existUser.username, otp);
            await sendNotificationEmail(existUser.email, "Your Password Reset OTP", htmlContent);

            res.json({
                success: true,
                msg: "OTP sent successfully to your email",
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success, error: "Internal Server Error" });
        }
    }
);

// Routes 4: Verify OTP by POST "/api/auth/verify-otp"
router.post("/verify-otp", [
    // Validation
    check("email", "Email is required").isEmail(),
    check("otp", "Enter 6 digit OTP").isLength({ min: 6, max: 6 }),
], async (req, res) => {
    const error = validationResult(req);

    // If some error occurs, then return the error
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const { email, otp } = req.body;

    let success = false;

    try {
        // Find user through exist email
        const user = await User.findOne({
            email,
            resetOTP: otp,
            resetOTPExpires: { $gt: Date.now() }
        });

        // Check user exist or not
        if(!user) {
            return res.status(400).json({ success, error: "Invalid or Expired OTP. Please try again." });
        }

        res.json({
            success: true,
            msg: "OTP verified successfully",
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Server Error" });
    }
})

// Routes 5: Reset Password by POST "/api/auth/reset-password/:token"
router.post(
    "/reset-password",
    [
        // Validation
        check("email", "Email is required").isEmail(),
        check("newPassword", "Password min 6 chars").isLength({ min: 6 }),
    ],
    async (req, res) => {
        const error = validationResult(req);

        // If some error occurs, then return the error
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        const { email, newPassword } = req.body;

        let success = false;

        try {
            // Find user through exist email
            const user = await User.findOne({
                email
            });

            // Check user exist or not
            if (!user) {
                return res.status(400).json({ success: false, error: "User not found" })
            };

            // To hash a password and store in DB
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);

            // Reset OTP and expiry to null
            user.resetOTP = null;
            user.resetOTPExpires = null;

            // Save user to DB
            await user.save();

            res.json({ success: true, msg: "Password has been reset successfully." });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success, error: "Internal Server Error" });
        }
    }
);

export default router;