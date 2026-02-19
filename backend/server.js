import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));

// Enhanced MongoDB Connection (Local Priority)
const connectDB = async () => {
  try {
    // Test local first, fallback to Atlas
    const localUri = process.env.MONGODB_URI || "mongodb://localhost:27017/studybuddy";
    
    await mongoose.connect(localUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ MongoDB Connected:", localUri.includes('localhost') ? "LOCAL" : "ATLAS");
    console.log("📊 Database: studybuddy");
    
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    console.log("💡 Starting in DEMO MODE (no persistence)");
  }
};

// Health check with DB status
app.get("/api/health", async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "✅ Connected" : "⚠️ Demo Mode";
  res.json({
    success: true,
    message: "StudyBuddy Backend - Phase 3 Complete",
    mongodb: dbStatus,
    local: mongoose.connection.name === "studybuddy",
    timestamp: new Date().toISOString()
  });
});

// Demo endpoints (still available for frontend testing)
app.get("/api/demo/dashboard", (req, res) => {
  res.json({
    studyStats: { today: 4.2, week: 25.5, yesterday: 3.2 },
    habits: [
      { id: 1, name: "Exercise", streak: 12, today: true },
      { id: 2, name: "Reading", streak: 8, today: false },
      { id: 3, name: "Water Intake", streak: 45, today: true },
      { id: 4, name: "8h Sleep", streak: 3, today: false }
    ],
    barData: [
      { name: "Sun", hours: 4 }, { name: "Mon", hours: 6 },
      { name: "Tue", hours: 4.5 }, { name: "Wed", hours: 7 },
      { name: "Thu", hours: 3.8 }, { name: "Fri", hours: 5 }, { name: "Sat", hours: 8 }
    ]
  });
});

// API Routes
app.use("/api/auth", authRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error("🚨 ERROR:", err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log("👋 MongoDB disconnected");
  process.exit(0);
});

// Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 StudyBuddy Backend - Phase 3 LIVE`);
    console.log(`📡 http://localhost:${PORT}`);
    console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Demo: http://localhost:${PORT}/api/demo/dashboard\n`);
  });
});
