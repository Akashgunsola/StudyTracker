import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  duration: {
    type: Number, // in minutes or seconds
    required: true
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  },
  topic_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic"
  }
}, {
  timestamps: true
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
