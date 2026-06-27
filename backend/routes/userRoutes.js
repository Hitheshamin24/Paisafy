const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");
const { handleUserAuth } = require("../controllers/userController");

router.use(requireAuth());

router.post("/", handleUserAuth);

module.exports = router;
