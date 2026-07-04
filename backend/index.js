require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");
const User = require("./models/User");

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : ["http://localhost:5173"];

    // Allow requests with no origin (Postman, mobile apps, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();

// Handle preflight OPTIONS requests for ALL routes (Express 5 syntax)
app.options("/*path", cors(corsOptions));
app.use(cors(corsOptions));
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

