import express from "express";
import User from "../model/User.model.js"
import Provider from "../model/Provider.model.js"
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendNotificationEmail } from "../utils/emailService.js";
import { getOTPTemplate } from "../utils/emailTemplates.js";
import validator from "validator";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import fs from "fs"
import { upload } from "../Middleware/Multer.js";


const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY;
console.log( process.env.JWT_SECRET_KEY)



// REGISTER USER

// router.post(
//   "/register/user",
//   [
//     check("name", "Name required").notEmpty(),
//     check("email", "Valid email required").isEmail(),
//     check("password", "Min 6 characters").isLength({ min: 6 }),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ success: false, errors: errors.array() });
//     }

//     try {
//       const { name, email, password } = req.body;

//       const username = name.trim().toLowerCase();
//       const normalizedEmail = email.toLowerCase();

//       const existingUser = await User.findOne({
//         $or: [{ username }, { email: normalizedEmail }],
//       });

//       if (existingUser) {
//         return res.status(400).json({
//           success: false,
//           message: "User already exists",
//         });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const user = await User.create({
//         username,
//         email: normalizedEmail,
//         password: hashedPassword,
//       });

//       const token = jwt.sign(
//         { id: user._id, role: "user" },
//         JWT_SECRET,
//         { expiresIn: "1h" }
//       );

//       return res.status(201).json({
//         success: true,
//         message: "User registered successfully",
//         token,
//         userId: user._id,
//       });

//     } catch (error) {
//       console.error("USER REGISTER ERROR:", error.message);
//       return res.status(500).json({ success: false, message: "Server error" });
//     }
//   }
// );



router.post(
  "/register/user",
  [
    check("name", "Name required").notEmpty(),
    check("email", "Valid email required").isEmail(),
    check("password", "Min 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;

      const username = name.trim().toLowerCase();
      const normalizedEmail = email.toLowerCase();

      const existingUser = await User.findOne({
        $or: [{ username }, { email: normalizedEmail }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email: normalizedEmail,
        password: hashedPassword,
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        userId: user._id,
      });

    } catch (error) {
      console.error("USER REGISTER ERROR:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

















// router.post(
//   "/register/provider",
//   upload.fields([
//     { name: "idProof", maxCount: 1 },
//     { name: "photoproof", maxCount: 1 },
//   ]),
//   [
//     check("name", "Name required").notEmpty(),
//     check("email", "Valid email required").isEmail(),
//     check("password", "Min 6 characters").isLength({ min: 6 }),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ success: false, errors: errors.array() });
//     }

//     try {
//       const { name, email, password, serviceType, address } = req.body;

//       const username = name.trim().toLowerCase();
//       const normalizedEmail = email.toLowerCase();

//       const existingProvider = await Provider.findOne({
//         $or: [{ username }, { email: normalizedEmail }],
//       });

//       if (existingProvider) {
//         return res.status(400).json({
//           success: false,
//           message: "Provider already exists",
//         });
//       }

//       // FILES
//       const idProofPath = req.files?.idProof?.[0]?.path;
//       const photoProofPath = req.files?.photoproof?.[0]?.path;

//       if (!idProofPath || !photoProofPath) {
//         return res.status(400).json({
//           success: false,
//           message: "Documents are required",
//         });
//       }

//       // UPLOAD CLOUDINARY
//       const idProofUpload = await uploadOnCloudinary(idProofPath);
//       const photoProofUpload = await uploadOnCloudinary(photoProofPath);

//       if (!idProofUpload || !photoProofUpload) {
//         return res.status(500).json({
//           success: false,
//           message: "File upload failed",
//         });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const provider = await Provider.create({
//         username,
//         email: normalizedEmail,
//         password: hashedPassword,
//         role: "pending_provider",
//         serviceType,
//         address,

//         documents: {
//           idProof: idProofUpload.secure_url,
//           photoproof: photoProofUpload.secure_url,
//         },

//         verificationStatus: "pending",
//       });

//       const token = jwt.sign(
//         { id: provider._id, role: "provider" },
//         JWT_SECRET,
//         { expiresIn: "1h" }
//       );

//       return res.status(201).json({
//         success: true,
//         message: "Provider registered successfully",
//         token,
//         providerId: provider._id,
//       });

//     } catch (error) {
//       console.error("PROVIDER REGISTER ERROR:", error.message);
//       return res.status(500).json({ success: false, message: "Server error" });
//     }
//   }
// );



router.post(
  "/register/provider",
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "photoproof", maxCount: 1 },
  ]),
  [
    check("name", "Name required").notEmpty(),
    check("email", "Valid email required").isEmail(),
    check("password", "Min 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password, serviceType, address } = req.body;

      const username = name.trim().toLowerCase();
      const normalizedEmail = email.toLowerCase();

      const existingProvider = await Provider.findOne({
        $or: [{ username }, { email: normalizedEmail }],
      });

      if (existingProvider) {
        return res.status(400).json({
          success: false,
          message: "Provider already exists",
        });
      }

      const idProofPath = req.files?.idProof?.[0]?.path;
      const photoProofPath = req.files?.photoproof?.[0]?.path;

      if (!idProofPath || !photoProofPath) {
        return res.status(400).json({
          success: false,
          message: "Documents are required",
        });
      }

      const idProofUpload = await uploadOnCloudinary(idProofPath);
      const photoProofUpload = await uploadOnCloudinary(photoProofPath);

      if (!idProofUpload || !photoProofUpload) {
        return res.status(500).json({
          success: false,
          message: "File upload failed",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const provider = await Provider.create({
        username,
        email: normalizedEmail,
        password: hashedPassword,
        role: "pending_provider",
        serviceType,
        address,
        documents: {
          idProof: idProofUpload.secure_url,
          photoproof: photoProofUpload.secure_url,
        },
        verificationStatus: "pending",
      });

      return res.status(201).json({
        success: true,
        message: "Provider registered successfully",
        providerId: provider._id,
      });

    } catch (error) {
      console.error("PROVIDER REGISTER ERROR:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);





// router.post(
//   "/login",
//   [
//     check("loginIdentifier", "Username or email required").notEmpty(),
//     check("password", "Password required").notEmpty(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array(),
//       });
//     }

//     try {
//       const { loginIdentifier, password } = req.body;

//       // ================= NORMALIZE INPUT =================
//       const sanitized = validator.isEmail(loginIdentifier)
//         ? validator.normalizeEmail(loginIdentifier).toLowerCase()
//         : loginIdentifier.toLowerCase();

//       // ================= FIND USER =================
//       let user = await User.findOne({
//         $or: [
//           { username: sanitized },
//           { email: sanitized }
//         ],
//       });

//       let type = "user";

//       if (!user) {
//         user = await Provider.findOne({
//           $or: [
//             { username: sanitized },
//             { email: sanitized }
//           ],
//         });

//         type = "provider";
//       }

//       if (!user) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid credentials",
//         });
//       }

//       // ================= PASSWORD CHECK =================
//       if (!user.password) {
//         return res.status(500).json({
//           success: false,
//           message: "Password not found in database",
//         });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);

//       if (!isMatch) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid credentials",
//         });
//       }

//       // ================= JWT TOKEN =================
//       const token = jwt.sign(
//         {
//           user: {
//             id: user._id,
//             role: user.role,
//             type: type,
//           },
//         },
//         process.env.JWT_SECRET_KEY,
//         { expiresIn: "24h" }
//       );

//       // ================= COOKIE SETUP =================
//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: false,        // set true in production (HTTPS)
//         sameSite: "lax",
//         maxAge: 24 * 60 * 60 * 1000, // 1 day
//       });

//       return res.status(200).json({
//         success: true,
//         message: "Login successful",
//         user: {
//           id: user._id,
//           username: user.username,
//           role: user.role,
//           type: type,
//         },
//       });

//     } catch (error) {
//       console.error("LOGIN ERROR:", error);

//       return res.status(500).json({
//         success: false,
//         message: "Internal Server Error",
//       });
//     }
//   }
// );







router.post(
  "/login",
  [
    check("loginIdentifier", "Username or email required").notEmpty(),
    check("password", "Password required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { loginIdentifier, password } = req.body;

      // ================= NORMALIZE INPUT =================
      const sanitized = validator.isEmail(loginIdentifier)
        ? validator.normalizeEmail(loginIdentifier).toLowerCase()
        : loginIdentifier.toLowerCase();

      // ================= FIND USER =================
      let user = await User.findOne({
        $or: [
          { username: sanitized },
          { email: sanitized }
        ],
      });

      if (!user) {
        user = await Provider.findOne({
          $or: [
            { username: sanitized },
            { email: sanitized }
          ],
        });
      }

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // ================= PASSWORD CHECK =================
      if (!user.password) {
        return res.status(500).json({
          success: false,
          message: "Password not found in database",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // ================= DETERMINE ROLE =================
      const role = user.role; 
      // MUST be "user" or "provider"

      // ================= JWT TOKEN =================
      const token = jwt.sign(
        {
          id: user._id,
          role: role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );

      // ================= COOKIE SETUP =================
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          role: role,
        },
      });

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
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