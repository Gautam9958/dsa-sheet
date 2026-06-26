import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../hooks/useProgress";
import TopicCard from "../components/Dashboard/TopicCard";
import Navbar from "../components/Layout/Navbar";
import api from "../utils/api";

const DashboardPage = () => {
  const { user } = useAuth();
  const { completedIds, loading: progressLoading } = useProgress();
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [problemsByTopic, setProblemsByTopic] = useState({});

  useEffect(() => {
    const fetchTopicsAndProblems = async () => {
      try {
        const { data: topicList } = await api.get("/topics");
        setTopics(topicList);

        // Fetch all topic problems in parallel
        const results = await Promise.all(
          topicList.map((t) => api.get(`/topics/${t._id}/problems`))
        );

        const map = {};
        results.forEach(({ data }) => {
          map[data.topic._id] = data.problems;
        });
        setProblemsByTopic(map);
      } catch (err) {
        console.error("Failed to load topics", err);
      } finally {
        setTopicsLoading(false);
      }
    };
    fetchTopicsAndProblems();
  }, []);

  // Count completed problems per topic
  const getCompletedCount = (topicId) => {
    const problems = problemsByTopic[topicId] || [];
    return problems.filter((p) => completedIds.has(p._id)).length;
  };

  const totalProblems = topics.reduce((sum, t) => sum + t.totalProblems, 0);
  const totalCompleted = completedIds.size;
  const overallPct = totalProblems === 0 ? 0 : Math.round((totalCompleted / totalProblems) * 100);

  const loading = topicsLoading || progressLoading;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Hey {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1">Pick up where you left off</p>
        </div>

        {/* Overall Progress Banner */}
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/40 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-300 text-sm">Overall Progress</p>
              <p className="text-white text-3xl font-bold mt-0.5">
                {totalCompleted}
                <span className="text-gray-400 text-lg font-normal">/{totalProblems}</span>
              </p>
            </div>
            <div className="text-4xl font-black text-blue-400">{overallPct}%</div>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>

        {/* Topics Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <>
            <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">
              Topics — {topics.length}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <TopicCard
                  key={topic._id}
                  topic={topic}
                  completedCount={getCompletedCount(topic._id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
