import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "StudyBuddy Backend",
    phase: "1-setup",
  });
});

// Root simple route
app.get("/", (req, res) => {
  res.send("StudyBuddy backend is running.");
});

// Use env PORT or default 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`StudyBuddy backend listening on port ${PORT}`);
});
