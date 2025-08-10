const mongoose = require("mongoose");

const RecommendationSchema = new mongoose.Schema({
  formData: { type: Object, required: true },
  result: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recommendation", RecommendationSchema);
