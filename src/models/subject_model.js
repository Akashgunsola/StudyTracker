import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  color: {
    type: String
  }
}, {
  timestamps: true
});

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
