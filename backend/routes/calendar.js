import express from "express";
import { protectRoute } from "./auth.js";
import Habit from "../models/Habit.js";
import Task from "../models/Task.js";
import StudySession from "../models/StudySession.js";
import Reminder from "../models/Reminder.js";
import DailyGoal from "../models/DailyGoal.js";

const router = express.Router();

router.get("/", protectRoute, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { start, end } = req.query; // optional date range filters
    
    // For simplicity, we fetch all for this user, but we should eventually filter by start/end.
    // In a real app we'd filter using `start` and `end`, but since StudyBuddy user datasets
    // are likely small, fetching all is okay for this version.

    const [habits, tasks, sessions, reminders, dailyGoals] = await Promise.all([
      Habit.find({ user: userId }),
      Task.find({ user: userId }),
      StudySession.find({ user: userId }),
      Reminder.find({ user: userId }),
      DailyGoal.find({ user: userId })
    ]);

    const events = [];

    // 1. Habits (Map completedDates to events)
    habits.forEach(habit => {
      if (habit.completedDates) {
        habit.completedDates.forEach(date => {
          const startDate = new Date(date);
          const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 min duration
          events.push({
            id: `habit-${habit._id}-${startDate.toISOString()}`,
            title: `${habit.emoji} ${habit.name}`,
            start: startDate,
            end: endDate,
            allDay: false,
            type: 'habit',
            color: habit.color || '#22c55e', // default green
          });
        });
      }
    });

    // 2. Tasks
    tasks.forEach(task => {
      if (task.dueDate) {
        events.push({
          id: `task-${task._id}`,
          title: `[Task] ${task.text}`,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          allDay: true,
          type: 'task',
          color: task.completed ? '#9ca3af' : '#f97316', // orange if pending, gray if done
          completed: task.completed
        });
      }
    });

    // 3. Study Sessions
    sessions.forEach(session => {
      const startTime = new Date(session.startTime);
      // Give it at least 15 mins (900s) on the calendar so it's visible
      const displayDuration = Math.max(session.durationInSeconds, 900);
      const endTime = new Date(startTime.getTime() + (displayDuration * 1000));
      events.push({
        id: `session-${session._id}`,
        title: `[Study] ${session.subject || 'General'}`,
        start: startTime,
        end: endTime,
        allDay: false,
        type: 'session',
        color: '#6366f1', // indigo
        duration: session.durationInSeconds
      });
    });

    // 4. Reminders
    reminders.forEach(reminder => {
      const startDate = new Date(reminder.deadline);
      const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 min duration
      events.push({
        id: `reminder-${reminder._id}`,
        title: `[Reminder] ${reminder.text}`,
        start: startDate,
        end: endDate,
        allDay: false,
        type: 'reminder',
        color: '#ef4444', // red
      });
    });

    // 5. Daily Goals
    dailyGoals.forEach(goal => {
      // goal.date is string "YYYY-MM-DD"
      const goalDateStr = goal.date; // YYYY-MM-DD
      const goalDate = new Date(`${goalDateStr}T00:00:00`);
      
      // Determine if missed or pending
      const todayDateStr = new Date().toISOString().slice(0,10);
      let statusStr = '';
      let colorStr = '';
      if (goal.achieved) {
        statusStr = 'Achieved!';
        colorStr = '#10b981'; // green
      } else if (goalDateStr > todayDateStr) {
        statusStr = 'Pending';
        colorStr = '#9ca3af'; // gray
      } else {
        statusStr = 'Missed';
        colorStr = '#f43f5e'; // red
      }

      events.push({
        id: `goal-${goal._id}`,
        title: `Daily Goal: ${statusStr}`,
        start: goalDate,
        end: goalDate,
        allDay: true,
        type: 'dailyGoal',
        color: colorStr
      });
    });

    res.json({ success: true, events });
  } catch (err) {
    console.error("Calendar fetch error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch calendar events" });
  }
});

export default router;
