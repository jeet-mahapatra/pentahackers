import Provider from "../model/Provider.model.js"

// ================= GET PROFILE =================
export const getProviderProfile = async (req, res) => {
  try {
    const providerId = req.user.id;

    const provider = await Provider.findById(providerId).select("-password");

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    return res.status(200).json(provider);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE PROFILE =================


// ================= UPDATE PROFILE =================
export const updateProviderProfile = async (req, res) => {
  try {
    const providerId = req.user.id;

    // 1. Extract ALL fields sent from the updated frontend
    const {
      serviceType,
      address,     // Comes as stringified JSON: '{"street":"","city":"","pincode":""}'
      timeSlots,   // Comes as stringified JSON array: '["9AM", "2PM"]'
      phone,       // New field
      experience,  // New field
      bio          // New field
    } = req.body;

    // 2. Extract file paths
    const idProof = req.files?.idProof?.[0]?.path;
    const photoproof = req.files?.photoproof?.[0]?.path;
    const certification = req.files?.certification?.[0]?.path; // 🔥 Capture new document

    // 3. Prepare the update object dynamically
    const updateData = {};

    if (serviceType !== undefined) updateData.serviceType = serviceType;
    if (phone !== undefined) updateData.phone = phone;
    if (experience !== undefined) updateData.experience = experience;
    if (bio !== undefined) updateData.bio = bio;

    // Parse Address safely
    if (address) {
      try {
        updateData.address = JSON.parse(address);
      } catch (e) {
        console.log("Failed to parse address, saving as string");
        updateData.address = address; // Fallback just in case
      }
    }

    // Parse TimeSlots safely
    if (timeSlots) {
      try {
        updateData.timeSlots = JSON.parse(timeSlots);
      } catch (e) {
        console.log("Failed to parse timeSlots");
      }
    }

    // 4. Safely update nested document fields using dot notation 
    // (This prevents overwriting existing documents if only 1 is uploaded)
    if (idProof) updateData["documents.idProof"] = idProof;
    if (photoproof) updateData["documents.photoproof"] = photoproof;
    if (certification) updateData["documents.certification"] = certification;

    // 5. Update the Database
    const updated = await Provider.findByIdAndUpdate(
      providerId,
      { $set: updateData }, // Use $set to safely merge new data
      { new: true }
    ).select("-password -resetOTP -resetOTPExpires"); // Exclude sensitive info

    if (!updated) {
      return res.status(404).json({ message: "Provider not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      provider: updated,
    });

  } catch (err) {
    console.error("Update Provider Error:", err);
    return res.status(500).json({ error: err.message });
  }
};