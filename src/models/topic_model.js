import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Topic = mongoose.model("Topic", topicSchema);
export default Topic;
