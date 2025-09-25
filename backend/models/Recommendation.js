const mongoose = require("mongoose");

const RecommendationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  formData: { type: Object, required: true },
  result: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
},
  { timestamps: true }
);

module.exports = mongoose.model("Recommendation", RecommendationSchema);
