import express from "express";
import Habit from "../models/Habit.js";
import { protectRoute } from "./auth.js";
const router = express.Router();

router.get("/", protectRoute, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.userId });
    res.json({ success: true, habits });
  } catch (err) { res.status(500).json({ success: false }); }
});

router.post("/", protectRoute, async (req, res) => {
  try {
    const habit = await Habit.create({ user: req.user.userId, name: req.body.name });
    res.status(201).json({ success: true, habit });
  } catch (err) { res.status(400).json({ success: false }); }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    res.json({ success: true, message: "Deleted" });
  } catch (err) { res.status(500).json({ success: false }); }
});

router.patch("/:id/toggle", protectRoute, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.userId });
    if (!habit) return res.status(404).json({ success: false });
    const today = new Date().setHours(0,0,0,0);
    const lastDone = habit.lastCompleted ? new Date(habit.lastCompleted).setHours(0,0,0,0) : null;
    if (lastDone === today) {
      habit.streak = Math.max(0, habit.streak - 1);
      habit.lastCompleted = null;
    } else {
      habit.streak += 1;
      habit.lastCompleted = new Date();
    }
    await habit.save();
    res.json({ success: true, habit });
  } catch (err) { res.status(500).json({ success: false }); }
});
export default router;
