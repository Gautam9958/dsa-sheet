import DifficultyBadge from "./DifficultyBadge";

const ProblemRow = ({ problem, completed, onToggle }) => {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all
        ${completed
          ? "bg-green-950/30 border-green-800/40"
          : "bg-gray-900 border-gray-700 hover:border-gray-500"
        }`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(problem._id)}
        className="w-4 h-4 rounded accent-green-500 cursor-pointer shrink-0"
      />

      {/* Problem title */}
      <span
        className={`flex-1 text-sm font-medium ${
          completed ? "line-through text-gray-500" : "text-white"
        }`}
      >
        {problem.order}. {problem.title}
      </span>

      {/* Difficulty badge */}
      <DifficultyBadge difficulty={problem.difficulty} />

      {/* Resource Links */}
      <div className="flex items-center gap-2 shrink-0">
        {problem.youtubeUrl && (
          <a
            href={problem.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube Tutorial"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-500 hover:text-red-400 transition-colors text-base"
          >
            ▶
          </a>
        )}
        {problem.leetcodeUrl && (
          <a
            href={problem.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="LeetCode"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-500 hover:text-yellow-400 transition-colors text-xs font-bold"
          >
            LC
          </a>
        )}
        {problem.articleUrl && (
          <a
            href={problem.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Article"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-500 hover:text-blue-400 transition-colors text-base"
          >
            📄
          </a>
        )}
      </div>
    </div>
  );
};

export default ProblemRow;
