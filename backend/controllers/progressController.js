const Progress = require("../models/Progress");

// GET /api/progress/me — All completed problem IDs for the logged-in user
const getMyProgress = async (req, res) => {
  try {
    const records = await Progress.find({ userId: req.user._id, completed: true });
    // Return just the IDs — frontend uses this to mark checkboxes
    const completedIds = records.map((r) => r.problemId.toString());
    res.json({ completedIds });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/progress/toggle — Check or uncheck a problem
const toggleProgress = async (req, res) => {
  try {
    const { problemId } = req.body;
    if (!problemId) return res.status(400).json({ message: "problemId is required" });

    const existing = await Progress.findOne({ userId: req.user._id, problemId });

    if (existing) {
      // Toggle: flip the completed state
      existing.completed = !existing.completed;
      if (existing.completed) existing.completedAt = new Date();
      await existing.save();
      return res.json({ problemId, completed: existing.completed });
    }

    // First time marking this problem
    const progress = await Progress.create({
      userId: req.user._id,
      problemId,
      completed: true,
      completedAt: new Date(),
    });

    res.status(201).json({ problemId, completed: progress.completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyProgress, toggleProgress };
