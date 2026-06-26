import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

const TopicCard = ({ topic, completedCount }) => {
  const navigate = useNavigate();
  const pct = topic.totalProblems === 0 ? 0 : Math.round((completedCount / topic.totalProblems) * 100);

  return (
    <div
      onClick={() => navigate(`/topic/${topic._id}`)}
      className="bg-gray-900 border border-gray-700 hover:border-blue-500 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-900/20 group"
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{topic.icon}</span>
          <div>
            <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
              {topic.title}
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">{topic.description}</p>
          </div>
        </div>
        {pct === 100 && (
          <span className="text-green-400 text-lg" title="Completed!">✅</span>
        )}
      </div>

      <ProgressBar completed={completedCount} total={topic.totalProblems} />
    </div>
  );
};

export default TopicCard;
