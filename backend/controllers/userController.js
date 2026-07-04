const { clerkClient } = require("@clerk/express");
const User = require("../models/User");

const handleUserAuth = async (req, res) => {
  const authData = req.auth();
  if (!authData || !authData.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = authData.userId;

  try {
    const clerkUser = await clerkClient.users.getUser(userId);

    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const firstName = clerkUser.firstName || "";
    const lastName = clerkUser.lastName || "";
    const name = lastName
      ? `${firstName} ${lastName}`
      : firstName || "Unknown User";

    let user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      user = new User({ clerkUserId: userId, email, name });
      await user.save();
      return res.status(201).json({ message: "User created", user });
    }

    res.status(200).json({ message: "User exists", user });
  } catch (error) {
    console.error("Error in /api/user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  handleUserAuth,
};
