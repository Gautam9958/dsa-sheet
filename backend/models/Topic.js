const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true },
    description:  { type: String, default: "" },
    icon:         { type: String, default: "📚" },
    order:        { type: Number, default: 0 },
    totalProblems:{ type: Number, default: 0 }, // Denormalized for fast dashboard render
  },
  { timestamps: true }
);

topicSchema.index({ order: 1 });

module.exports = mongoose.model("Topic", topicSchema);
