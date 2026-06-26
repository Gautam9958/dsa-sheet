import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import ProblemRow from "../components/Problem/ProblemRow";
import ProgressBar from "../components/Dashboard/ProgressBar";
import { useProgress } from "../hooks/useProgress";
import api from "../utils/api";

const FILTERS = ["All", "Easy", "Medium", "Hard"];

const TopicPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completedIds, toggleProblem, loading: progressLoading } = useProgress();

  const [topic, setTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/topics/${id}/problems`);
        setTopic(data.topic);
        setProblems(data.problems);
      } catch {
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filtered = filter === "All" ? problems : problems.filter((p) => p.difficulty === filter);
  const completedCount = problems.filter((p) => completedIds.has(p._id)).length;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1.5 transition-colors"
        >
          ← Back to Dashboard
        </button>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-xl h-14 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Topic header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">{topic?.icon}</span>
                <h1 className="text-2xl font-bold text-white">{topic?.title}</h1>
              </div>
              <p className="text-gray-400 text-sm ml-12">{topic?.description}</p>
              <div className="ml-12 mt-3 max-w-sm">
                <ProgressBar completed={completedCount} total={problems.length} />
              </div>
            </div>

            {/* Difficulty filter */}
            <div className="flex gap-2 mb-5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {f}
                  {f !== "All" && (
                    <span className="ml-1.5 text-xs opacity-70">
                      ({problems.filter((p) => p.difficulty === f).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Problem list */}
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No problems found</p>
              ) : (
                filtered.map((problem) => (
                  <ProblemRow
                    key={problem._id}
                    problem={problem}
                    completed={completedIds.has(problem._id)}
                    onToggle={toggleProblem}
                  />
                ))
              )}
            </div>

            {/* Summary footer */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              {completedCount} of {problems.length} problems completed in {topic?.title}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopicPage;
