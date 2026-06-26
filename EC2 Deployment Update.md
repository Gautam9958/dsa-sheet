# ☁️ AWS Deployment Guide

## Production Deployment (Single EC2 Instance)

**Stack**
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Web Server: Nginx
- Process Manager: PM2

---

## Step 1: Set up MongoDB Atlas

1. Create a free MongoDB Atlas cluster.
2. Create a database user.
3. Whitelist your EC2 IP (or `0.0.0.0/0` during development).
4. Copy the connection string for your backend `.env`.

---

## Step 2: Launch EC2

- Ubuntu 22.04 LTS
- t2.micro (Free Tier)
- Allow ports **22**, **80**, and **5000** (optional if only Nginx is exposed).

SSH:

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

Install Node.js and PM2:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

Clone the project:

```bash
git clone https://github.com/yourusername/dsa-sheet.git
cd dsa-sheet
```

---

## Step 3: Deploy Backend

```bash
cd backend
npm install

# Create .env
nano .env

node utils/seedData.js

pm2 start server.js --name dsa-backend
pm2 save
pm2 startup
```

---

## Step 4: Build & Deploy Frontend

On your local machine:

```bash
cd frontend

echo "VITE_API_URL=http://<EC2_PUBLIC_IP>/api" > .env.production

npm install
npm run build
```

Upload the build:

```bash
scp -i your-key.pem -r dist ubuntu@<EC2_PUBLIC_IP>:/home/ubuntu/dsa-sheet/frontend/
```

---

## Step 5: Configure Nginx

```bash
sudo apt update
sudo apt install nginx -y

sudo nano /etc/nginx/sites-available/dsa-sheet
```

Paste:

```nginx
server {
    listen 80;
    server_name _;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /home/ubuntu/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/dsa-sheet /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 6: Backend Environment

Example:

```env
PORT=5000
MONGO_URI=<MongoDB Atlas URI>
JWT_SECRET=<your-secret>
CLIENT_URL=http://<EC2_PUBLIC_IP>
```

---

## Live URLs

| Service | URL |
|---------|-----|
| Frontend | http://<EC2_PUBLIC_IP> |
| Backend API | http://<EC2_PUBLIC_IP>/api |
| Database | MongoDB Atlas |

---

## Optional

- Add a custom domain.
- Enable HTTPS using Certbot.
- Later you can scale using Load Balancer, CloudFront, Redis, or multiple EC2 instances.

---

## Useful PM2 Commands

```bash
pm2 list
pm2 logs dsa-backend
pm2 restart dsa-backend
pm2 stop dsa-backend
```
