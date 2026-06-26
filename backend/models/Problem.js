const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    topicId:     { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    title:       { type: String, required: true, trim: true },
    difficulty:  { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    order:       { type: Number, default: 0 },

    // Learning Resources
    youtubeUrl:  { type: String, default: "" },
    leetcodeUrl: { type: String, default: "" },
    articleUrl:  { type: String, default: "" },

    tags:        [{ type: String }],
    notes:       { type: String, default: "" },
  },
  { timestamps: true }
);

// Index for fast topic-wise sorted fetch (most common query)
problemSchema.index({ topicId: 1, order: 1 });
problemSchema.index({ difficulty: 1 });

module.exports = mongoose.model("Problem", problemSchema);
