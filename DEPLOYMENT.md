# Deployment Guide

## Table of Contents
1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Alternative: VPS Deployment](#alternative-vps-deployment)
5. [Post-Deployment Checklist](#post-deployment-checklist)

---

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (Free M0 tier available)

### 2. Configure Database Access
1. Go to **Database Access**
2. Click **Add New Database User**
3. Create username and password (save these!)
4. Grant **Read and Write** permissions

### 3. Configure Network Access
1. Go to **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (0.0.0.0/0)
   - Or add specific IPs for better security

### 4. Get Connection String
1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `seo-blog`

Example:
```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/seo-blog?retryWrites=true&w=majority
```

---

## Backend Deployment (Railway)

### 1. Prepare Repository
```bash
cd blog
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### 2. Deploy to Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click **New Project**
4. Select **Deploy from GitHub repo**
5. Choose your repository
6. Select **backend** directory as root

### 3. Configure Environment Variables
In Railway dashboard, add these variables:

```env
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-production-key-min-32-chars
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!
PORT=5000
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

### 4. Deploy
- Railway will automatically deploy
- Note your backend URL: `https://your-app.railway.app`

---

## Frontend Deployment (Vercel)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy Frontend
```bash
cd frontend
vercel login
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **seo-blog-frontend**
- Directory? **./frontend**
- Override settings? **N**

### 3. Configure Environment Variables

In Vercel dashboard or via CLI:

```bash
vercel env add NEXT_PUBLIC_API_URL
```

Enter value: `https://your-backend.railway.app`

### 4. Deploy to Production
```bash
vercel --prod
```

Your site will be live at: `https://your-app.vercel.app`

### 5. Update Backend FRONTEND_URL
Go back to Railway and update:
```
FRONTEND_URL=https://your-app.vercel.app
```

---

## Alternative: VPS Deployment

### Prerequisites
- Ubuntu 20.04+ VPS
- Domain name (optional)
- SSH access

### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### 2. Clone and Setup Application

```bash
# Clone repository
cd /var/www
sudo git clone your-repo-url blog
cd blog

# Setup Backend
cd backend
sudo npm install
sudo cp .env.example .env
sudo nano .env  # Edit with your values
```

Backend `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/seo-blog
JWT_SECRET=your-production-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword
PORT=5000
FRONTEND_URL=http://your-domain.com
NODE_ENV=production
```

```bash
# Setup Frontend
cd ../frontend
sudo npm install
sudo cp .env.local.example .env.local
sudo nano .env.local  # Edit with your values
```

Frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://your-domain.com/api
```

```bash
# Build Frontend
sudo npm run build
```

### 3. Start with PM2

```bash
# Start Backend
cd /var/www/blog/backend
pm2 start server.js --name blog-api

# Start Frontend
cd /var/www/blog/frontend
pm2 start npm --name blog-frontend -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/blog
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## Post-Deployment Checklist

### ✅ Security
- [ ] Changed default admin password
- [ ] Updated JWT_SECRET to strong random string
- [ ] Enabled HTTPS/SSL
- [ ] Configured CORS properly
- [ ] Set NODE_ENV=production

### ✅ SEO
- [ ] Verified sitemap.xml is accessible
- [ ] Checked robots.txt configuration
- [ ] Submitted sitemap to Google Search Console
- [ ] Verified meta tags on live site
- [ ] Tested Open Graph tags (Facebook Debugger)

### ✅ Performance
- [ ] Tested page load speed (Lighthouse)
- [ ] Verified SSR is working (view page source)
- [ ] Checked mobile responsiveness
- [ ] Tested on multiple browsers

### ✅ Functionality
- [ ] Admin login works
- [ ] Can create/edit/delete blogs
- [ ] Can create categories
- [ ] Blog posts display correctly
- [ ] Pagination works
- [ ] Category filtering works

### ✅ Monitoring
- [ ] Setup error logging
- [ ] Configure uptime monitoring
- [ ] Setup database backups
- [ ] Monitor server resources

---

## Updating Deployed Application

### Vercel (Frontend)
```bash
cd frontend
git pull
vercel --prod
```

### Railway (Backend)
- Push to GitHub
- Railway auto-deploys on push

### VPS
```bash
cd /var/www/blog
sudo git pull

# Update Backend
cd backend
sudo npm install
pm2 restart blog-api

# Update Frontend
cd ../frontend
sudo npm install
sudo npm run build
pm2 restart blog-frontend
```

---

## Troubleshooting

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure password doesn't contain special characters (URL encode if needed)

### CORS Errors
- Verify FRONTEND_URL matches exactly (no trailing slash)
- Check NEXT_PUBLIC_API_URL is correct

### 502 Bad Gateway (Nginx)
- Check if PM2 processes are running: `pm2 status`
- Restart services: `pm2 restart all`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Build Failures
- Clear caches and rebuild
- Check Node.js version compatibility
- Verify all environment variables are set

---

## Support

For deployment issues:
1. Check application logs
2. Review environment variables
3. Verify all services are running
4. Consult platform-specific documentation

---

**Deployment Complete! 🎉**

Your SEO blog is now live and ready for the world!
