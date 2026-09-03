const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");

const {
  generateRecommendation,
  saveRecommendation,
  checkRecommendation,
  fetchRecommendation,
} = require("../controllers/recommendationController");

const { recommendSchema, validate } = require("../validators/recommendationValidator");
const { getCacheStats } = require("../services/cacheService");

// Generate recommendation — validated by Zod before reaching the controller
router.post("/recommend", validate(recommendSchema), generateRecommendation);

// Save or update recommendation
router.post("/save-recommendation", requireAuth(), saveRecommendation);

// Check if a recommendation exists for the logged in user
router.get("/check-recommendation/:userId", requireAuth(), checkRecommendation);

// Fetch a recommendation for the logged in user
router.get("/fetch-recommendation/:userId", requireAuth(), fetchRecommendation);

// Dev-only: inspect cache hit/miss stats
router.get("/cache/stats", (req, res) => {
  res.json(getCacheStats());
});

module.exports = router;


