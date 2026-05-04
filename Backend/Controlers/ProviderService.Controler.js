import Provider from "../model/Provider.model.js";
// ADD SLOT
export const addTimeSlot = async (req, res) => {
  try {
    const { slot } = req.body;

    if (!slot || !slot.trim()) {
      return res.status(400).json({ message: "Invalid slot" });
    }

    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({ message: "User not found" });
    }

    const cleanSlot = slot.trim();

    if (provider.timeSlots.includes(cleanSlot)) {
      return res.status(409).json({ message: "Slot already exists" });
    }

    provider.timeSlots.push(cleanSlot);
    await provider.save();

    return res.json({
      data: {
        timeSlots: provider.timeSlots,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// REMOVE SLOT
export const removeTimeSlot = async (req, res) => {
  try {
    const { slot } = req.body;

    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({ message: "User not found" });
    }

    provider.timeSlots = provider.timeSlots.filter(
      (s) => s !== slot.trim()
    );

    await provider.save();

    return res.json({
      data: {
        timeSlots: provider.timeSlots,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};