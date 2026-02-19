import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Route Imports
import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habits.js";
import sessionRoutes from "./routes/sessions.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const localUri = process.env.MONGODB_URI || "mongodb://localhost:27017/studybuddy";
    await mongoose.connect(localUri);
    console.log("✅ MongoDB Connected: LOCAL");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
  }
};

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/sessions", sessionRoutes);

// Demo data fallback (Keep for dashboard charts until Phase 7 is fully finished)
app.get("/api/demo/dashboard", (req, res) => {
  res.json({
    barData: [
      { name: "Sun", hours: 4 }, { name: "Mon", hours: 6 },
      { name: "Tue", hours: 4.5 }, { name: "Wed", hours: 7 },
      { name: "Thu", hours: 3.8 }, { name: "Fri", hours: 5 }, { name: "Sat", hours: 8 }
    ]
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true, 
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" 
  });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 StudyBuddy Backend LIVE on http://localhost:${PORT}`);
  });
});
