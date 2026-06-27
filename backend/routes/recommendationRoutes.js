const express = require("express");
const router = express.Router();
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const {
  generateRecommendation,
  saveRecommendation,
  checkRecommendation,
  fetchRecommendation,
} = require("../controllers/recommendationController");

// Generate recommendation (previously in index.js)
router.post("/recommend", generateRecommendation);

// Save or update recommendation
router.post("/save-recommendation", ClerkExpressRequireAuth(), saveRecommendation);

// Check if a recommendation exists for the logged in user
router.get("/check-recommendation/:userId", ClerkExpressRequireAuth(), checkRecommendation);

// Fetch a recommendation for the logged in user
router.get("/fetch-recommendation/:userId", ClerkExpressRequireAuth(), fetchRecommendation);

module.exports = router;
