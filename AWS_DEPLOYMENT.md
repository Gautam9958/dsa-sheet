# ☁️ AWS Deployment Guide

## Option A — Simple (EC2 for backend + S3 for frontend)

---

### Step 1: Set up MongoDB Atlas (Free Tier)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Create a DB user (username + password)
4. Whitelist IP: `0.0.0.0/0` (allow all for now)
5. Copy the **connection string** — you'll need it for `.env`

---

### Step 2: Deploy Backend on EC2

```bash
# 1. Launch EC2 instance
# - AMI: Ubuntu 22.04 LTS
# - Type: t2.micro (free tier)
# - Security Group: allow ports 22 (SSH), 80 (HTTP), 5000

# 2. SSH into your instance
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install PM2 (keeps app running)
sudo npm install -g pm2

# 5. Clone your project
git clone https://github.com/yourusername/dsa-sheet.git
cd dsa-sheet/backend

# 6. Create .env file
nano .env
# Paste your environment variables

# 7. Install dependencies & seed
npm install
node utils/seedData.js

# 8. Start with PM2
pm2 start server.js --name dsa-backend
pm2 save
pm2 startup   # auto-start on reboot
```

---

### Step 3: Deploy Frontend on S3

```bash
# On your LOCAL machine:
cd frontend

# Set the API URL to your EC2 public IP
echo "VITE_API_URL=http://<EC2_PUBLIC_IP>:5000" > .env.production

# Build the React app
npm run build
# This creates a /dist folder

# Upload to S3:
# 1. Create an S3 bucket (e.g. dsa-sheet-app)
# 2. Enable "Static website hosting"
# 3. Set index document: index.html
# 4. Set error document: index.html  (important for React Router)
# 5. Make bucket public
aws s3 sync dist/ s3://dsa-sheet-app --acl public-read
```

---

### Step 4: Setup Nginx on EC2 (optional but recommended)

```bash
sudo apt install nginx -y

sudo nano /etc/nginx/sites-available/dsa-sheet
```

Paste this Nginx config:
```nginx
server {
    listen 80;
    server_name <YOUR_EC2_PUBLIC_IP>;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/dsa-sheet /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Step 5: Update CORS in backend

In `backend/.env`:
```
CLIENT_URL=http://your-s3-bucket.s3-website-region.amazonaws.com
```

---

## Your Live URLs

| Service  | URL                                                          |
|----------|--------------------------------------------------------------|
| Frontend | `http://dsa-sheet-app.s3-website-us-east-1.amazonaws.com`   |
| Backend  | `http://<EC2_PUBLIC_IP>/api`                                 |
| MongoDB  | MongoDB Atlas (managed)                                      |

---

## Optional: Add a Custom Domain

1. Register domain on Route 53 (or use existing)
2. Point A record to EC2 IP
3. Install Certbot for HTTPS:
   ```bash
   sudo snap install --classic certbot
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Useful PM2 Commands

```bash
pm2 list              # Check running processes
pm2 logs dsa-backend  # View live logs
pm2 restart dsa-backend
pm2 stop dsa-backend
```
