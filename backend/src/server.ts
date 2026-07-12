import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import uploadRoutes from "./routes/uploadRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-vercel-app.vercel.app"],
  }),
);
app.use(express.json());

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes
app.use("/upload", uploadRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    message: "GrowEasy Backend is Running 🚀",
  });
});

// Render provides PORT automatically
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
