






import User from "../model/User.model.js";
import Provider from "../model/Provider.model.js";

const getMe = async (req, res) => {
  try {
    let account;

    // 🔥 check user first
    account = await User.findById(req.user.id).select(
       "_id username email role"
    );

    // 🔥 if not found → check provider
    if (!account) {
      account = await Provider.findById(req.user.id).select(
         "_id username email role serviceType timeSlots"
      );
    }

    if (!account) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(account);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { getMe };