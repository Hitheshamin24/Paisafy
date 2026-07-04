const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");

const {
  generateRecommendation,
  saveRecommendation,
  checkRecommendation,
  fetchRecommendation,
} = require("../controllers/recommendationController");

// Generate recommendation (previously in index.js)
router.post("/recommend", generateRecommendation);

// Save or update recommendation
router.post("/save-recommendation", requireAuth(), saveRecommendation);

// Check if a recommendation exists for the logged in user
router.get("/check-recommendation/:userId", requireAuth(), checkRecommendation);

// Fetch a recommendation for the logged in user
router.get("/fetch-recommendation/:userId", requireAuth(), fetchRecommendation);

module.exports = router;

