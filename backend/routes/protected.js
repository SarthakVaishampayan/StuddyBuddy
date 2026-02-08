import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protected dashboard data (requires JWT)
router.get("/dashboard", protect, (req, res) => {
  res.json({
    success: true,
    message: "Protected dashboard data accessed ✅",
    user: req.user,
    stats: {
      totalStudyHours: 156.5,
      tasksCompleted: 42,
      currentStreak: 12,
      habitsActive: 4
    }
  });
});

export default router;
