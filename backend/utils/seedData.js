/**
 * Seed Script — Run once to populate topics and problems
 * Usage: node utils/seedData.js
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
dotenv.config(); // Also try local .env

const Topic = require("../models/Topic");
const Problem = require("../models/Problem");

const TOPICS = [
  { title: "Arrays", description: "Fundamental array operations and patterns", icon: "🔢", order: 1 },
  { title: "Strings", description: "String manipulation and pattern matching", icon: "🔤", order: 2 },
  { title: "Linked Lists", description: "Singly, doubly, and circular linked lists", icon: "🔗", order: 3 },
  { title: "Stacks & Queues", description: "LIFO and FIFO data structures", icon: "📦", order: 4 },
  { title: "Binary Trees", description: "Tree traversals, views, and properties", icon: "🌲", order: 5 },
  { title: "Binary Search Tree", description: "Search, insert, delete in BST", icon: "🔍", order: 6 },
  { title: "Dynamic Programming", description: "Memoization, tabulation, optimization", icon: "⚡", order: 7 },
  { title: "Graphs", description: "BFS, DFS, shortest paths, connectivity", icon: "🕸️", order: 8 },
];

const PROBLEMS = {
  Arrays: [
    { title: "Two Sum", difficulty: "Easy", order: 1, leetcodeUrl: "https://leetcode.com/problems/two-sum/", youtubeUrl: "https://www.youtube.com/watch?v=KLlXCFG5TnA", articleUrl: "https://www.geeksforgeeks.org/two-sum-problem/", tags: ["hash-map"] },
    { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", order: 2, leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", youtubeUrl: "https://www.youtube.com/watch?v=1pkOgXD63yU", articleUrl: "https://www.geeksforgeeks.org/stock-buy-sell/", tags: ["sliding-window"] },
    { title: "Maximum Subarray (Kadane's)", difficulty: "Medium", order: 3, leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/", youtubeUrl: "https://www.youtube.com/watch?v=86CQq3pKSUw", articleUrl: "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/", tags: ["kadane", "dp"] },
    { title: "Container With Most Water", difficulty: "Medium", order: 4, leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/", youtubeUrl: "https://www.youtube.com/watch?v=UuiTKBwPgAo", articleUrl: "https://www.geeksforgeeks.org/container-with-most-water/", tags: ["two-pointer"] },
    { title: "Trapping Rain Water", difficulty: "Hard", order: 5, leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/", youtubeUrl: "https://www.youtube.com/watch?v=ZI2z5pq0TqA", articleUrl: "https://www.geeksforgeeks.org/trapping-rain-water/", tags: ["two-pointer", "stack"] },
  ],
  Strings: [
    { title: "Valid Anagram", difficulty: "Easy", order: 1, leetcodeUrl: "https://leetcode.com/problems/valid-anagram/", youtubeUrl: "https://www.youtube.com/watch?v=9UtInBqnCgA", articleUrl: "https://www.geeksforgeeks.org/check-whether-two-strings-are-anagram/", tags: ["hash-map"] },
    { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", order: 2, leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", youtubeUrl: "https://www.youtube.com/watch?v=wiGpQwVHdE0", articleUrl: "https://www.geeksforgeeks.org/length-of-the-longest-substring-without-repeating-characters/", tags: ["sliding-window", "hash-map"] },
    { title: "Valid Parentheses", difficulty: "Easy", order: 3, leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/", youtubeUrl: "https://www.youtube.com/watch?v=WTzjTskDFMg", articleUrl: "https://www.geeksforgeeks.org/check-for-balanced-parentheses-in-an-expression/", tags: ["stack"] },
    { title: "Longest Palindromic Substring", difficulty: "Medium", order: 4, leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/", youtubeUrl: "https://www.youtube.com/watch?v=XYQecbcd6_c", articleUrl: "https://www.geeksforgeeks.org/longest-palindrome-substring-set-1/", tags: ["dp", "expand-around-center"] },
  ],
  "Linked Lists": [
    { title: "Reverse Linked List", difficulty: "Easy", order: 1, leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/", youtubeUrl: "https://www.youtube.com/watch?v=G0_I-ZF0S38", articleUrl: "https://www.geeksforgeeks.org/reverse-a-linked-list/", tags: ["iteration", "recursion"] },
    { title: "Detect Cycle in Linked List", difficulty: "Easy", order: 2, leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/", youtubeUrl: "https://www.youtube.com/watch?v=wiOo4DC5GGA", articleUrl: "https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/", tags: ["slow-fast-pointer"] },
    { title: "Merge Two Sorted Lists", difficulty: "Easy", order: 3, leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/", youtubeUrl: "https://www.youtube.com/watch?v=XIdigk956u0", articleUrl: "https://www.geeksforgeeks.org/merge-two-sorted-linked-lists/", tags: ["recursion"] },
    { title: "LRU Cache", difficulty: "Hard", order: 4, leetcodeUrl: "https://leetcode.com/problems/lru-cache/", youtubeUrl: "https://www.youtube.com/watch?v=7ABFKPK2hD4", articleUrl: "https://www.geeksforgeeks.org/lru-cache-implementation/", tags: ["hash-map", "doubly-linked-list"] },
  ],
  "Binary Trees": [
    { title: "Inorder Traversal", difficulty: "Easy", order: 1, leetcodeUrl: "https://leetcode.com/problems/binary-tree-inorder-traversal/", youtubeUrl: "https://www.youtube.com/watch?v=Z_NEgBgbRVI", articleUrl: "https://www.geeksforgeeks.org/inorder-traversal-of-binary-tree/", tags: ["recursion", "stack"] },
    { title: "Maximum Depth of Binary Tree", difficulty: "Easy", order: 2, leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", youtubeUrl: "https://www.youtube.com/watch?v=hTM3phVI6YQ", articleUrl: "https://www.geeksforgeeks.org/find-maximum-depth-binary-tree/", tags: ["dfs", "bfs"] },
    { title: "Level Order Traversal", difficulty: "Medium", order: 3, leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/", youtubeUrl: "https://www.youtube.com/watch?v=6ZnyEApgFYg", articleUrl: "https://www.geeksforgeeks.org/level-order-tree-traversal/", tags: ["bfs", "queue"] },
    { title: "Lowest Common Ancestor", difficulty: "Medium", order: 4, leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", youtubeUrl: "https://www.youtube.com/watch?v=_-QHfMDde90", articleUrl: "https://www.geeksforgeeks.org/lowest-common-ancestor-binary-tree-set-1/", tags: ["recursion"] },
  ],
  "Dynamic Programming": [
    { title: "Climbing Stairs", difficulty: "Easy", order: 1, leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/", youtubeUrl: "https://www.youtube.com/watch?v=Y0lT9Fck7qI", articleUrl: "https://www.geeksforgeeks.org/count-ways-reach-nth-stair/", tags: ["fibonacci", "memoization"] },
    { title: "0/1 Knapsack", difficulty: "Medium", order: 2, leetcodeUrl: "https://leetcode.com/problems/partition-equal-subset-sum/", youtubeUrl: "https://www.youtube.com/watch?v=8LusJS5-AGo", articleUrl: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/", tags: ["knapsack", "tabulation"] },
    { title: "Longest Common Subsequence", difficulty: "Medium", order: 3, leetcodeUrl: "https://leetcode.com/problems/longest-common-subsequence/", youtubeUrl: "https://www.youtube.com/watch?v=Ua0GhsJSlWM", articleUrl: "https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/", tags: ["lcs", "2d-dp"] },
    { title: "Word Break", difficulty: "Medium", order: 4, leetcodeUrl: "https://leetcode.com/problems/word-break/", youtubeUrl: "https://www.youtube.com/watch?v=1ads994lHoQ", articleUrl: "https://www.geeksforgeeks.org/word-break-problem-dp-32/", tags: ["dp", "trie"] },
    { title: "Edit Distance", difficulty: "Hard", order: 5, leetcodeUrl: "https://leetcode.com/problems/edit-distance/", youtubeUrl: "https://www.youtube.com/watch?v=We3YDTzNXEk", articleUrl: "https://www.geeksforgeeks.org/edit-distance-dp-5/", tags: ["dp", "string"] },
  ],
  Graphs: [
    { title: "Number of Islands", difficulty: "Medium", order: 1, leetcodeUrl: "https://leetcode.com/problems/number-of-islands/", youtubeUrl: "https://www.youtube.com/watch?v=pV2kpPD66nE", articleUrl: "https://www.geeksforgeeks.org/find-number-of-islands/", tags: ["bfs", "dfs", "matrix"] },
    { title: "Clone Graph", difficulty: "Medium", order: 2, leetcodeUrl: "https://leetcode.com/problems/clone-graph/", youtubeUrl: "https://www.youtube.com/watch?v=mQeF6bN8hMk", articleUrl: "https://www.geeksforgeeks.org/clone-an-undirected-graph/", tags: ["bfs", "hash-map"] },
    { title: "Course Schedule (Topological Sort)", difficulty: "Medium", order: 3, leetcodeUrl: "https://leetcode.com/problems/course-schedule/", youtubeUrl: "https://www.youtube.com/watch?v=EgI5nU9etnU", articleUrl: "https://www.geeksforgeeks.org/topological-sorting/", tags: ["topological-sort", "cycle-detection"] },
  ],
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clean up existing data
    await Topic.deleteMany({});
    await Problem.deleteMany({});
    console.log("Cleared existing topics and problems");

    for (const topicData of TOPICS) {
      const problemList = PROBLEMS[topicData.title] || [];
      const topic = await Topic.create({
        ...topicData,
        totalProblems: problemList.length,
      });

      for (const p of problemList) {
        await Problem.create({ ...p, topicId: topic._id });
      }

      console.log(`✅ Seeded: ${topic.title} (${problemList.length} problems)`);
    }

    console.log("\n🎉 Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
};

seed();
