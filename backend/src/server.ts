import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/upload", uploadRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "GrowEasy Backend is Running 🚀",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
