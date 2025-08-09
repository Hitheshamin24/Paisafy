const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./db"); // MongoDB connection
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.post("/api/recommend", async (req, res) => {
  try {
    const mlResponse = await axios.post("http://localhost:8000/predict", req.body);
    res.json(mlResponse.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "ML server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
