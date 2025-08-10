const express = require("express");
const router = express.Router();

const { clerkClient } = require("@clerk/clerk-sdk-node");
const User = require("../models/User");
const { requireAuth } = require("@clerk/express");

router.use(requireAuth());

router.post("/", async (req, res) => {
  console.log("POST /api/user called");
  console.log("req.auth:", req.auth);

  if (!req.auth || !req.auth.userId) {
    console.log("Unauthorized: no userId in req.auth");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.auth.userId;
  console.log("User ID from token:", userId);

  try {
    const clerkUser = await clerkClient.users.getUser(userId);
    console.log("Clerk user fetched:", clerkUser);

    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const firstName = clerkUser.firstName || "";
    const lastName = clerkUser.lastName || "";
    const name = lastName
      ? `${firstName} ${lastName}`
      : firstName || "Unknown User";

    let user = await User.findOne({ clerkUserId: userId });
    console.log("User found in DB:", user);

    if (!user) {
      user = new User({ clerkUserId: userId, email, name });
      await user.save();
      console.log("New user saved:", user);
      return res.status(201).json({ message: "User created", user });
    }

    console.log("User already exists");
    res.status(200).json({ message: "User exists", user });
  } catch (error) {
    console.error("Error in /api/user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
