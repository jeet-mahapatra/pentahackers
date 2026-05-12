// import User from "../model/User.model.js";
// import Provider from "../model/Provider.model.js";

// const getMe = async (req, res) => {
//   try {
//     let account;

//     // 🔥 check user first
//     account = await User.findById(req.user.id).select(
//        "_id username email role"
//     );

//     // 🔥 if not found → check provider
//     if (!account) {
//       account = await Provider.findById(req.user.id).select(
//          "_id username email role serviceType timeSlots"
//       );
//     }

//     if (!account) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.json(account);

//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// export { getMe };






import User from "../model/User.model.js";
import Provider from "../model/Provider.model.js";

const getMe = async (req, res) => {
  try {
    let account;
    let accountType;

    // Check User first
    account = await User.findById(req.user.id).select(
      "_id username email role status fullName phoneNumber bio address state country pinCode timezone createdAt updatedAt"
    );

    if (account) {
      accountType = "user";
    }

    // If not found → check Provider
    if (!account) {
      account = await Provider.findById(req.user.id).select(
        "_id username email role phone serviceType isProfessional experience bio timeSlots address documents verificationStatus deletionDate createdAt updatedAt"
      );
      if (account) {
        accountType = "provider";
      }
    }

    if (!account) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return account data with accountType flag so the frontend knows which model was matched
    return res.json({ ...account.toObject(), accountType });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { getMe };