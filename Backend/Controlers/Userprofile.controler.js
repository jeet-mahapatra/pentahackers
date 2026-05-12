import User from "../model/User.model.js";

// ─────────────────────────────────────────────
// GET  /api/userProfile/me
// Returns the logged-in user's full profile
// ─────────────────────────────────────────────
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -resetOTP -resetOTPExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// PUT  /api/userProfile/update
// Updates editable fields on the User model.
// Non-editable: username, email, password, role, status
// ─────────────────────────────────────────────
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName,
      phoneNumber,
      bio,
      address,
      state,
      country,
      pinCode,
      timezone,
    } = req.body;

    // Build update object — only include fields the caller sent
    const updateData = {};

    if (fullName    !== undefined) updateData.fullName    = fullName.trim();
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber.trim();
    if (bio         !== undefined) {
      if (bio.length > 500) {
        return res.status(400).json({ message: "Bio cannot exceed 500 characters." });
      }
      updateData.bio = bio.trim();
    }
    if (address  !== undefined) updateData.address  = address.trim();
    if (state    !== undefined) updateData.state    = state.trim();
    if (country  !== undefined) updateData.country  = country.trim();
    if (pinCode  !== undefined) updateData.pinCode  = pinCode.trim();
    if (timezone !== undefined) updateData.timezone = timezone.trim();

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -resetOTP -resetOTPExpires");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
      success: true,
    });
  } catch (err) {
    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    return res.status(500).json({ error: err.message });
  }
};