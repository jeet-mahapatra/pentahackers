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
export const updateProviderProfile = async (req, res) => {
  try {
    const providerId = req.user.id;

    const {
      serviceType,
      address,
      timeSlots,
    } = req.body;

    const idProof = req.files?.idProof?.[0]?.path;
    const photoproof = req.files?.photoproof?.[0]?.path;

    const updated = await Provider.findByIdAndUpdate(
      providerId,
      {
        serviceType,
        address,
        ...(timeSlots && { timeSlots: JSON.parse(timeSlots) }),
        ...(idProof && { "documents.idProof": idProof }),
        ...(photoproof && { "documents.photoproof": photoproof }),
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      provider: updated,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};