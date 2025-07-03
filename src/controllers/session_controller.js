import Session from "../models/session_model.js";

import { updateStreakAfterSession } from "./streak_controller.js";

// Create a study session & update streak
export const createSession = async (req, res) => {
  try {
    const { duration, subject_id, topic_id } = req.body;

    const session = await Session.create({
      user_id: req.user.id,
      duration,
      subject_id,
      topic_id,
    });

    const updatedStreak = await updateStreakAfterSession(req.user.id);

    res.status(201).json({
      success: true,
      session,
      streak: updatedStreak,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all sessions of the user
export const getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a specific session
export const deleteSession = async (req, res) => {
  try {
    await Session.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
    res.json({ success: true, message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
