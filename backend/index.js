require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");
const User = require("./models/User");


const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import user routes
const userRoutes = require("./routes/userRoutes");

// Your existing routes and setup (Clerk middleware is inside userRoutes)
app.post("/api/recommend", async (req, res) => {
  try {
    const flaskRes = await axios.post(`${process.env.FLASK_URL}/predict`, req.body);
    res.json(flaskRes.data);
  } catch (err) {
    console.error("Error calling Flask:", err.message);
    res.status(500).json({ error: "Failed to get recommendation" });
  }
});




// Use recommendation routes
app.use("/api", require("./routes/recommendationRoutes"));

// Use the user routes under /api/user
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
