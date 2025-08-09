const express = require("express");
const router = express.Router();
const { createTest, getTests } = require("../controllers/testControllers");

router.post("/test-db", createTest);
router.get("/get-tests", getTests);

module.exports = router;
