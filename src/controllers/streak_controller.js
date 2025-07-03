import Streak from "../models/streak_model.js";

//  Get logged-in user's streak
export const getStreak = async (req, res) => {
  try {
    const streak = await Streak.findOne({ user_id: req.user.id });
    res.status(200).json({ success: true, streak });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Update streak logic after a session is created
export const updateStreakAfterSession = async (userId) => {
  const today = new Date().toDateString();
  let streak = await Streak.findOne({ user_id: userId });

  if (!streak) {
    // First streak
    streak = await Streak.create({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: today,
    });
    return streak;
  }

  const last = new Date(streak.last_active_date).toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (last === today) {
    return streak; // Already updated today
  }

  if (last === yesterday) {
    streak.current_streak += 1;
  } else {
    streak.current_streak = 1;
  }

  if (streak.current_streak > streak.longest_streak) {
    streak.longest_streak = streak.current_streak;
  }

  streak.last_active_date = today;
  await streak.save();
  return streak;
};
