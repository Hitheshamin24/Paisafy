const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  name: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
