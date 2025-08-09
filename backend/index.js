const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", require("./routes/testRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Delete a document by its _id
app.delete("/api/delete-test/:id", async (req, res) => {
  try {
    const result = await Test.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json({ message: "Document deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete document" });
  }
});
