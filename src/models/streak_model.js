import mongoose from "mongoose";

const streakSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true // one-to-one relationship
  },
  current_streak: {
    type: Number,
    default: 0
  },
  longest_streak: {
    type: Number,
    default: 0
  },
  last_active_date: {
    type: Date
  }
}, {
  timestamps: true
});

const Streak = mongoose.model("Streak", streakSchema);
export default Streak;
