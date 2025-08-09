const Test = require("../models/test");

// Save a new document
const createTest = async (req, res) => {
  try {
    const newDoc = new Test({ name: req.body.name });
    await newDoc.save();
    res.json({ message: "Document saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save document" });
  }
};

// Get all documents
const getTests = async (req, res) => {
  try {
    const docs = await Test.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

module.exports = { createTest, getTests };
