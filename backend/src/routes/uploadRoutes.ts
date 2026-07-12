import express from "express";
import upload from "../middleware/upload";
import { readCSV } from "../services/csvService";
import { mapCustomers } from "../services/aiService";

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // Read CSV
    const data = await readCSV(req.file.path);

    // Send all customers to Gemini
    const mappedCustomers = await mapCustomers(data);

    // Convert AI output to CSV

    res.json({
      message: "Batch AI Mapping Successful",
      totalRows: data.length,
      processedRows: mappedCustomers.length,
      results: mappedCustomers,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Error processing CSV",
      error: error.message,
    });
  }
});

export default router;
