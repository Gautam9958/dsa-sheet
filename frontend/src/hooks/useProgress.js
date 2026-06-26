import { useState, useEffect } from "react";
import api from "../utils/api";

// Manages all progress state — fetches on mount, provides toggle function
export const useProgress = () => {
  const [completedIds, setCompletedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await api.get("/progress/me");
        setCompletedIds(new Set(data.completedIds));
      } catch (err) {
        console.error("Failed to load progress", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const toggleProblem = async (problemId) => {
    // Optimistic UI update — feels instant to user
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.has(problemId) ? next.delete(problemId) : next.add(problemId);
      return next;
    });

    try {
      await api.post("/progress/toggle", { problemId });
    } catch (err) {
      // Revert on failure
      setCompletedIds((prev) => {
        const next = new Set(prev);
        next.has(problemId) ? next.delete(problemId) : next.add(problemId);
        return next;
      });
      console.error("Toggle failed", err);
    }
  };

  return { completedIds, toggleProblem, loading };
};
