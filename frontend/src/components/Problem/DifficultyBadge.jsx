const colors = {
  Easy:   "bg-green-900/50 text-green-400 border border-green-700",
  Medium: "bg-yellow-900/50 text-yellow-400 border border-yellow-700",
  Hard:   "bg-red-900/50 text-red-400 border border-red-700",
};

const DifficultyBadge = ({ difficulty }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[difficulty] || ""}`}>
    {difficulty}
  </span>
);

export default DifficultyBadge;
