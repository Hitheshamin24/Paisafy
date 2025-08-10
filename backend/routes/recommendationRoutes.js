const express = require("express");
const router = express.Router();
const Recommendation = require("../models/Recommendation");
// const { requireAuth } = require("@clerk/clerk-sdk-node");

// Save recommendation (protected route)
router.post("/save-recommendation", async (req, res) => {
  try {
    const { formData, result } = req.body;

    if (!formData || !result) {
      return res.status(400).json({ message: "Missing formData or result" });
    }

    const newRecommendation = new Recommendation({
      formData,
      result,
    });

    await newRecommendation.save();

    res.status(201).json({ message: "Recommendation saved successfully!" });
  } catch (error) {
    console.error("Error saving recommendation:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
