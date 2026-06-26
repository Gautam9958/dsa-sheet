# 🗃️ Database Schema — DSA Sheet (LLD)

## Collections Overview

```
MongoDB Database: dsasheet
├── users
├── topics
├── problems
└── progress
```

---

## 1. Users Collection

```js
{
  _id: ObjectId,              // Auto-generated
  name: String,               // "Rahul Sharma"
  email: String,              // "rahul@email.com" — unique
  password: String,           // bcrypt hash
  role: String,               // "student" | "admin"
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` → unique index (fast login lookup)

---

## 2. Topics Collection

```js
{
  _id: ObjectId,
  title: String,              // "Arrays", "Binary Trees", "Dynamic Programming"
  description: String,        // Short summary of the topic
  order: Number,              // Display order (1, 2, 3...)
  icon: String,               // Emoji or icon name "🔢"
  totalProblems: Number,      // Denormalized count for fast display
  createdAt: Date
}
```

**Indexes:**
- `order` → for sorted listing

---

## 3. Problems Collection

```js
{
  _id: ObjectId,
  topicId: ObjectId,          // Ref → topics._id
  title: String,              // "Two Sum"
  difficulty: String,         // "Easy" | "Medium" | "Hard"
  order: Number,              // Position within topic

  // Learning Resources
  youtubeUrl: String,         // "https://youtube.com/..."
  leetcodeUrl: String,        // "https://leetcode.com/problems/..."
  articleUrl: String,         // "https://geeksforgeeks.org/..."

  tags: [String],             // ["hash-map", "two-pointer"]
  notes: String,              // Optional tip/hint
  createdAt: Date
}
```

**Indexes:**
- `topicId` → compound with `order` for fast topic-wise fetching
- `difficulty` → for filtering

---

## 4. Progress Collection

```js
{
  _id: ObjectId,
  userId: ObjectId,           // Ref → users._id
  problemId: ObjectId,        // Ref → problems._id
  completed: Boolean,         // true = checked
  completedAt: Date,          // When they completed it
  createdAt: Date
}
```

**Indexes:**
- `{ userId: 1, problemId: 1 }` → **unique compound index**
  - This is the most critical index: every checkbox toggle hits this
  - Prevents duplicate entries, makes upsert O(log n)
- `userId` → for fetching all progress of one student

---

## Entity Relationship Diagram

```
┌──────────┐        ┌──────────┐        ┌──────────┐
│  Users   │        │  Topics  │        │ Problems │
│──────────│        │──────────│        │──────────│
│ _id  PK  │        │ _id  PK  │◄───────│ topicId  │
│ name     │        │ title    │        │ title    │
│ email    │        │ order    │        │difficulty│
│ password │        │ totalPro.│        │ youtubeUrl│
└──────────┘        └──────────┘        │leetcodeUrl│
     │                                  │articleUrl│
     │          ┌──────────┐            └──────────┘
     │          │ Progress │                  │
     │          │──────────│                  │
     └─────────►│ userId   │◄─────────────────┘
                │ problemId│
                │completed │
                └──────────┘
```

---

## API Endpoints (Optional / Bonus)

```
AUTH
  POST   /api/auth/register       Register new student
  POST   /api/auth/login          Login → returns JWT
  GET    /api/auth/me             Get logged-in user info

TOPICS
  GET    /api/topics              List all topics
  GET    /api/topics/:id/problems List problems for a topic

PROGRESS
  GET    /api/progress/me         Get all completed problem IDs for user
  POST   /api/progress/toggle     Toggle problem complete/incomplete
    body: { problemId: "..." }
```

---

## Design Trade-offs

| Decision               | Choice Made             | Trade-off                                |
|------------------------|-------------------------|------------------------------------------|
| Auth storage           | JWT in localStorage     | Simple but less secure; cookies are better for prod |
| Progress model         | One doc per (user+problem) | Fast upsert; slightly more storage   |
| Topics in DB vs code   | MongoDB                 | Easy admin edits; slight read overhead   |
| Caching                | Optional Redis          | Speeds up topics list; adds infra cost   |
| Password hashing       | bcrypt (10 rounds)      | Secure; slight CPU cost on login         |
