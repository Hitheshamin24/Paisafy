const express = require("express");
const router = express.Router();

const { clerkClient } = require("@clerk/clerk-sdk-node");
const User = require("../models/User");

// Middleware to require auth (pass it from index.js or require here)
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// Protect all routes in this router
router.use(ClerkExpressRequireAuth());

router.post("/", async (req, res) => {
  try {
    console.log("Received /api/user request");

    const userId = req.auth.userId;
    console.log("Clerk userId:", userId);

    const clerkUser = await clerkClient.users.getUser(userId);
    console.log("Clerk user object:", clerkUser);

    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const name = `${clerkUser.firstName} ${clerkUser.lastName}`.trim();

    console.log("User data extracted:", { email, name });

    let user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      console.log("User not found in DB, creating new user...");
      user = new User({ clerkUserId: userId, email, name });
      await user.save();
      console.log("User saved successfully:", user);
      return res.status(201).json({ message: "User created", user });
    }

    console.log("User already exists:", user);
    res.status(200).json({ message: "User exists", user });
  } catch (error) {
    console.error("Error in /api/user:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
