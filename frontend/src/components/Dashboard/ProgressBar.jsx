const ProgressBar = ({ completed, total }) => {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const color =
    pct === 100
      ? "bg-green-500"
      : pct >= 50
      ? "bg-blue-500"
      : "bg-gray-500";

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{completed}/{total} solved</span>
        <span className={pct === 100 ? "text-green-400 font-semibold" : ""}>{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
