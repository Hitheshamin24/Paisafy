require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");
const User = require("./models/User");

const app = express();
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Connect to MongoDB
connectDB();

// Import user routes
const userRoutes = require("./routes/userRoutes");



// Use recommendation routes
app.use("/api", require("./routes/recommendationRoutes"));

// Use the user routes
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

