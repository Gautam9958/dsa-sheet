const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ─── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/topics",   require("./routes/topicRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));

// ─── Health Check ─────────────────────────────────────────────
app.get("/api", (req, res) => res.json({ status: "DSA Sheet API is running 🚀" }));

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ─── Error Handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
