# 🧠 DSA Sheet — MERN Stack Assignment

A full-stack DSA (Data Structures & Algorithms) tracker with login, topic-wise problems, difficulty tags, learning resources, and per-user progress tracking.

---

## 📁 Project Structure

```
dsa-sheet-assignment/
├── backend/                  ← Node.js + Express + MongoDB
│   ├── config/
│   │   └── db.js             ← MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── topicController.js
│   │   └── progressController.js
│   ├── middleware/
│   │   └── authMiddleware.js  ← JWT verification
│   ├── models/
│   │   ├── User.js
│   │   ├── Topic.js
│   │   ├── Problem.js
│   │   └── Progress.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── topicRoutes.js
│   │   └── progressRoutes.js
│   ├── utils/
│   │   └── seedData.js        ← Pre-populate DSA problems
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/                  ← React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   └── LoginForm.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── TopicCard.jsx
│   │   │   │   └── ProgressBar.jsx
│   │   │   ├── Problem/
│   │   │   │   ├── ProblemRow.jsx
│   │   │   │   └── DifficultyBadge.jsx
│   │   │   └── Layout/
│   │   │       └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useProgress.js
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── TopicPage.jsx
│   │   ├── utils/
│   │   │   └── api.js         ← Axios base config
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── SYSTEM_DESIGN.md
├── DATABASE_SCHEMA.md
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone and Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Setup

Create `backend/.env`:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dsasheet
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
```

### 3. Seed the Database

```bash
cd backend
node utils/seedData.js
```

### 4. Run the App

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

App runs at: `http://localhost:5173`

---

## 📦 Tech Stack

| Layer      | Technology           |
|------------|----------------------|
| Frontend   | React 18, Vite, TailwindCSS |
| Backend    | Node.js, Express.js  |
| Database   | MongoDB Atlas        |
| Auth       | JWT + bcryptjs       |
| Deployment | AWS EC2 + S3 / Nginx |

---

## ✅ Features

- 🔐 Secure login with JWT
- 📚 Topic-wise DSA problems (Arrays, Trees, DP, etc.)
- 🎯 Easy / Medium / Hard difficulty badges
- 🔗 YouTube, LeetCode, Article links per problem
- ☑️ Checkbox progress tracking (saved per user)
- 📊 Per-topic progress bars
- 💾 Progress persists across sessions
