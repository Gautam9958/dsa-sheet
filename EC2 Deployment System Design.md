# 📐 System Design — DSA Sheet (HLD)

## Architecture Overview

```
                    Internet
                        │
                        ▼
                AWS EC2 Instance
         ┌─────────────────────────────┐
         │           Nginx             │
         │                             │
         │  /        → React (Vite)    │
         │  /api     → Express API     │
         └──────────────┬──────────────┘
                        │
                Node.js + Express
                        │
                        ▼
                  MongoDB Atlas
```

---

## Request Flow

### Login

```
User
  │
  ▼
POST /api/auth/login
  │
Express validates credentials
  │
JWT generated
  │
Frontend stores token
```

### Dashboard

```
GET /api/topics
GET /api/progress/me

Frontend merges topic data with user progress.
```

### Toggle Progress

```
POST /api/progress/toggle

JWT verified
↓

MongoDB updated

↓

Updated progress returned
```

---

## Authentication

- bcryptjs for password hashing
- JWT authentication
- Authorization header: `Bearer <token>`
- Token expiry: 7 days
- httpOnly cookies recommended for production

---

## Deployment Architecture

```
Internet
   │
   ▼
AWS EC2
   │
   ▼
Nginx
 ├── React Frontend
 └── Node.js API
         │
         ▼
   MongoDB Atlas
```

---

## Scalability

| Concern | Current Solution |
|---------|------------------|
| Process Management | PM2 |
| Reverse Proxy | Nginx |
| Database | MongoDB Atlas |
| Frontend Hosting | React served by Nginx |
| API | Express.js |
| Future Scaling | Add Load Balancer, CloudFront, Redis, Auto Scaling, Multiple EC2 instances when needed |

---

## Advantages

- Simple production deployment
- Single EC2 instance reduces cost
- Easy maintenance
- Nginx serves frontend and API
- MongoDB Atlas provides managed database hosting
- Easy to scale in the future
