const Topic = require("../models/Topic");
const Problem = require("../models/Problem");

// GET /api/topics — All topics (for dashboard cards)
const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/topics/:id/problems — Problems under a topic
const getTopicProblems = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const problems = await Problem.find({ topicId: req.params.id }).sort({ order: 1 });
    res.json({ topic, problems });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTopics, getTopicProblems };
