import Topic from "../models/topic_model.js";

// Create a topic under a subject
const createTopic = async (req, res) => {
  try {
    const { name, subject_id } = req.body;
    const topic = await Topic.create({
      name,
      subject_id,
      isCompleted: false,
    });
    res.status(201).json({ success: true, topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all topics for a subject
const getTopicsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const topics = await Topic.find({ subject_id: subjectId });
    res.json({ success: true, topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle or update topic completion
const toggleTopicCompletion = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ success: false, message: "Topic not found" });

    topic.isCompleted = !topic.isCompleted;
    await topic.save();

    res.json({ success: true, topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a topic
const deleteTopic = async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Topic deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {createTopic, deleteTopic, toggleTopicCompletion, getTopicsBySubject}