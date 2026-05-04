

import Provider from "../model/Provider.model.js";
import { Review } from "../model/Review.model.js";

export const getApprovedProviders = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {
      role: "approved_provider",
    };

    // ✅ SAFE SEARCH
    if (search && search.trim() !== "") {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { serviceType: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const providers = await Provider.find(query)
      .select("-password -documents -resetOTP -resetOTPExpires");

    const result = [];

    for (let p of providers) {
      const reviews = await Review.find({
        serviceProvider: p._id,
      });

      let avgRating = 0;
      let minRating = 0;
      let maxRating = 0;

      if (reviews.length > 0) {
        const ratings = reviews.map(r => r.rating);

        const total = ratings.reduce((a, b) => a + b, 0);

        avgRating = total / ratings.length;
        minRating = Math.min(...ratings);
        maxRating = Math.max(...ratings);
      }

      result.push({
        ...p.toObject(),
        avgRating,
        minRating,
        maxRating,
        totalReviews: reviews.length,
      });
    }

    res.json({ providers: result });

  } catch (err) {
    console.error("❌ Provider fetch error:", err);
    res.status(500).json({ error: err.message });
  }
};