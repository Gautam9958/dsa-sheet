const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problemId:   { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    completed:   { type: Boolean, default: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Critical index: every checkbox toggle hits this lookup
progressSchema.index({ userId: 1, problemId: 1 }, { unique: true });
// For fetching all completed problems of a user
progressSchema.index({ userId: 1 });

module.exports = mongoose.model("Progress", progressSchema);
