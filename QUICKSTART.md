# SEO Blog - Quick Start Guide

## Prerequisites Check
- ✅ Node.js 18+ installed
- ✅ MongoDB installed and running
- ✅ npm package manager

## Quick Start (Development)

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# MongoDB should be running as a service
# Or start manually:
mongod
```

**Mac/Linux:**
```bash
brew services start mongodb-community
# Or:
sudo systemctl start mongod
```

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5000`

### 4. Start Frontend Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:3000`

## Default Admin Credentials

- **Username:** `admin`
- **Password:** `Admin@123`

⚠️ **IMPORTANT:** Change these in `backend/.env` for production!

## Access Points

- **Website:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
- **API Health:** http://localhost:5000/health
- **Sitemap:** http://localhost:3000/sitemap.xml
- **Robots.txt:** http://localhost:3000/robots.txt

## First Steps

1. **Access Admin Dashboard**
   - Go to http://localhost:3000/admin/login
   - Login with default credentials
   
2. **Create a Category**
   - Click "+ New Category"
   - Enter name and description
   - Click "Create Category"

3. **Create Your First Blog Post**
   - Click "+ New Blog Post"
   - Fill in title, select category
   - Write content in Markdown
   - Add SEO metadata (optional)
   - Choose "Published" status
   - Click "Create Blog"

4. **View Your Blog**
   - Go to http://localhost:3000
   - Your blog post should appear!

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `backend/.env` or kill the process using that port

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:** Run `npm install` in the respective directory

## Production Deployment

See the main README.md for detailed deployment instructions.

## Need Help?

Check the main README.md for:
- Complete API documentation
- Database schema
- Deployment guides
- Customization options

---

Happy Blogging! 🚀
