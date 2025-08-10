require("dotenv").config();
// const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");



const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");

// const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Clerk middleware (needs env vars set)
// app.use(ClerkExpressWithAuth());

// Route that talks to Flask
app.post("/api/recommend", async (req, res) => {
  try {
    const flaskRes = await axios.post("http://127.0.0.1:8000/predict", req.body);
    res.json(flaskRes.data);
  } catch (err) {
    console.error("Error calling Flask:", err.message);
    res.status(500).json({ error: "Failed to get recommendation" });
  }
});

// Other routes...
app.use("/api", require("./routes/recommendationRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
