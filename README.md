# SEO Blog Platform

A professional, production-ready blog platform built with **Next.js**, **Express**, and **MongoDB**. Optimized for SEO with server-side rendering, dynamic sitemaps, and comprehensive meta tag management.

## 🚀 Features

### Public Features
- ✅ Server-side rendered pages for optimal SEO
- ✅ Home page with latest blog posts
- ✅ Blog listing with pagination and category filtering
- ✅ Individual blog pages with full SEO metadata
- ✅ Category pages
- ✅ About page
- ✅ Responsive, modern design
- ✅ Dynamic sitemap.xml generation
- ✅ robots.txt configuration

### Admin Features
- ✅ Secure JWT-based authentication
- ✅ Complete blog CRUD operations
- ✅ Markdown editor with live preview
- ✅ Draft/Publish workflow
- ✅ Category management
- ✅ SEO metadata editor for each blog
- ✅ Automatic slug generation
- ✅ Slug immutability after publishing

### SEO Features
- ✅ Meta title and description
- ✅ Keywords management
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data
- ✅ Server-side rendering (SSR)
- ✅ Dynamic sitemap.xml
- ✅ Optimized robots.txt

## 📁 Project Structure

```
blog/
├── backend/                    # Express API server
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Authentication middleware
│   │   ├── controllers/       # Business logic
│   │   └── utils/             # Helper functions
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # Reusable components
│   │   ├── lib/               # API client & utilities
│   │   └── styles/            # CSS modules
│   ├── public/
│   ├── next.config.js
│   └── package.json
│
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **React Markdown** - Markdown rendering
- **SimpleMDE** - Markdown editor
- **Axios** - HTTP client
- **date-fns** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Slugify** - URL slug generation

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd blog
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/seo-blog
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Start the backend server:

```bash
# Development
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The website will be available at `http://localhost:3000`

## 📊 Database Schema

### Blog Schema
```javascript
{
  title: String,
  slug: String (unique, auto-generated),
  content: String (Markdown),
  excerpt: String,
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  canonicalUrl: String,
  ogImage: String,
  category: ObjectId (ref: Category),
  status: 'draft' | 'published',
  author: String,
  publishedAt: Date,
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Schema
```javascript
{
  name: String (unique),
  slug: String (unique, auto-generated),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Get all published blogs |
| GET | `/api/blogs/:slug` | Get single blog by slug |
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:slug` | Get category with blogs |
| GET | `/api/sitemap.xml` | Generate sitemap |
| GET | `/api/robots.txt` | Get robots.txt |

### Admin Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/admin/verify` | Verify token |
| GET | `/api/admin/blogs` | Get all blogs (including drafts) |
| GET | `/api/admin/blogs/:id` | Get blog by ID |
| POST | `/api/admin/blogs` | Create new blog |
| PUT | `/api/admin/blogs/:id` | Update blog |
| DELETE | `/api/admin/blogs/:id` | Delete blog |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |

## 👤 Admin Access

1. Navigate to `http://localhost:3000/admin/login`
2. Use credentials from your `.env` file:
   - Username: `admin` (or your configured username)
   - Password: Your configured password

## 🌐 Deployment

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Backend Deployment (Railway/Render)

1. **Create a MongoDB Atlas database** (free tier available)
   - Get your connection string

2. **Deploy to Railway/Render**:
   - Connect your GitHub repository
   - Set environment variables:
     ```
     MONGODB_URI=your-mongodb-atlas-uri
     JWT_SECRET=your-production-secret
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=your-secure-password
     PORT=5000
     FRONTEND_URL=https://your-frontend-domain.vercel.app
     NODE_ENV=production
     ```
   - Deploy from `backend` directory

#### Frontend Deployment (Vercel)

1. **Deploy to Vercel**:
   ```bash
   cd frontend
   vercel
   ```

2. **Set environment variables** in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Single Server (VPS/Cloud)

1. **Setup MongoDB** on your server or use MongoDB Atlas

2. **Clone repository** on server:
   ```bash
   git clone your-repo-url
   cd blog
   ```

3. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create .env with production values
   npm start
   ```

4. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   npm start
   ```

5. **Use PM2** for process management:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name blog-api
   pm2 start frontend/npm --name blog-frontend -- start
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx** as reverse proxy

## 🔧 Configuration

### Slug Generation Rules
- Automatically generated from blog title
- Converted to lowercase
- Special characters removed
- Spaces replaced with hyphens
- **Immutable after publishing** (prevents broken links)

### SEO Best Practices
- All pages use SSR for search engine crawling
- Meta tags dynamically generated per page
- Sitemap updates automatically with new content
- Canonical URLs prevent duplicate content issues
- Open Graph tags for social media sharing

## 📝 Creating Your First Blog Post

1. Login to admin dashboard
2. Click "New Blog Post"
3. Fill in:
   - Title (required)
   - Category (required)
   - Content in Markdown (required)
   - Excerpt (optional, auto-generated if empty)
   - SEO metadata (optional, defaults to title/excerpt)
4. Choose status: Draft or Published
5. Click "Create Blog"

## 🎨 Customization

### Changing Colors
Edit `frontend/src/styles/globals.css`:

```css
:root {
  --primary: #6366f1;
  --secondary: #ec4899;
  --accent: #14b8a6;
  /* ... */
}
```

### Adding New Pages
Create new files in `frontend/src/app/your-page/page.js`

### Modifying API
Add new routes in `backend/src/routes/index.js`
Add controllers in `backend/src/controllers/`

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas, whitelist your IP address

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env`
- Check CORS configuration in `backend/server.js`

### Build Errors
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, Express, and MongoDB**
