const express = require("express");
const router = express.Router();
const Recommendation = require("../models/Recommendation");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// Save or update recommendation 
router.post(
  "/save-recommendation",
  ClerkExpressRequireAuth(),
  async (req, res) => {
    try {
      const { userId } = req.auth; 
      const { formData, result } = req.body;

      if (!formData || !result) {
        return res.status(400).json({ message: "Missing formData or result" });
      }

      // Find existing recommendation for this user and update it or create new if none exists
      const updatedRecommendation = await Recommendation.findOneAndUpdate(
        { userId },
        { formData, result },
        { new: true, upsert: true } 
      );

      res.status(200).json({
        message: "Recommendation saved/updated successfully!",
        recommendation: updatedRecommendation,
      });
    } catch (error) {
      console.error("Error saving/updating recommendation:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Check if a recommendation exists for the logged in user
router.get(
  "/check-recommendation/:userId",
  ClerkExpressRequireAuth(),
  async (req, res) => {
    try {
      const { userId } = req.params; 
      const recommendation = await Recommendation.findOne({ userId });
      res.json({ exists: !!recommendation }); 
    } catch (error) {
      console.error("Error checking recommendation:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
module.exports = router;
