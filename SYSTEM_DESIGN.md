# 📐 System Design — DSA Sheet (HLD)

## Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                         CLIENT                             │
│              React (Vite) — Hosted on AWS S3               │
│          Login Page │ Dashboard │ Topic View               │
└─────────────────────────┬──────────────────────────────────┘
                          │  HTTPS (REST API)
                          ▼
┌────────────────────────────────────────────────────────────┐
│                   AWS EC2 (Load Balanced)                  │
│              Nginx (Reverse Proxy / SSL)                   │
│                          │                                 │
│              Node.js + Express API Server                  │
│   /api/auth   /api/topics   /api/progress                  │
└───────────────┬────────────────────────────────────────────┘
                │
    ┌───────────┴─────────────┐
    ▼                         ▼
┌──────────────┐     ┌────────────────┐
│  MongoDB     │     │  Redis Cache   │
│  Atlas       │     │  (Sessions,    │
│  (Primary DB)│     │   Hot Topics)  │
└──────────────┘     └────────────────┘
```

---

## Request Flow

### 1. Login Flow
```
User → POST /api/auth/login
     → authController validates email + password (bcrypt)
     → Issues JWT (expires in 7d)
     → Frontend stores JWT in localStorage
     → All subsequent requests include: Authorization: Bearer <token>
```

### 2. Load Dashboard (Topics + Progress)
```
User → GET /api/topics          (fetch all topics & problems)
     → GET /api/progress/me     (fetch this user's completed problems)
     → Frontend merges: marks checkboxes as checked
     → Renders topic cards with live progress bars
```

### 3. Toggle Problem Complete
```
User checks a checkbox
     → POST /api/progress/toggle { problemId }
     → authMiddleware verifies JWT, extracts userId
     → progressController: upsert Progress record
     → Returns updated progress count
     → Frontend updates state (no page reload needed)
```

---

## Authentication Mechanism

- **bcryptjs** hashes passwords before storing (salt rounds: 10)
- **JWT** token issued on login, stored in client localStorage
- **authMiddleware** runs on every protected route:
  ```js
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.id;
  ```
- Token expiry: 7 days (balance between UX and security)
- For production: Use httpOnly cookies instead of localStorage

---

## Scalability Considerations (10k–50k users)

| Concern              | Solution                                          |
|----------------------|---------------------------------------------------|
| DB reads (topics)    | Cache topics in Redis (TTL 1hr) — static data     |
| Progress writes      | MongoDB upsert is O(1) with proper indexing       |
| Auth at scale        | Stateless JWT — no server-side session storage    |
| Traffic spikes       | AWS Auto Scaling Group on EC2                     |
| DB connection limit  | Mongoose connection pooling (max: 10 per instance)|
| Frontend delivery    | React build → AWS S3 + CloudFront CDN             |
| API scalability      | Add AWS ALB (Application Load Balancer)           |

---

## AWS Deployment Architecture

```
Internet
   │
   ▼
Route 53 (DNS)
   │
   ├──▶ CloudFront + S3 ──▶ React Frontend (static)
   │
   └──▶ ALB (Load Balancer)
              │
         ┌────┴────┐
         EC2-1    EC2-2      ← Node.js instances
         │
         ├──▶ MongoDB Atlas (managed, multi-region)
         └──▶ ElastiCache Redis (optional, for caching)
```
