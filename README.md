# SEO Blog Platform - Backend API

A professional, production-ready RESTful API for a blog platform built with **Express.js** and **MongoDB**. Provides comprehensive endpoints for blog management, authentication, and SEO features.

## 🚀 Features

### Public API
- ✅ Get all published blogs with pagination
- ✅ Get single blog by slug
- ✅ Category listing and filtering
- ✅ Dynamic sitemap.xml generation
- ✅ robots.txt endpoint

### Admin API (Protected)
- ✅ Secure JWT-based authentication
- ✅ Complete blog CRUD operations
- ✅ Draft/Publish workflow
- ✅ Category management
- ✅ SEO metadata management
- ✅ Automatic slug generation
- ✅ Slug immutability after publishing

### SEO Features
- ✅ Meta title and description support
- ✅ Keywords management
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data support
- ✅ Dynamic sitemap generation

## 📁 Project Structure

```
blog-backend/
├── src/
│   ├── config/            # Database configuration
│   ├── models/            # MongoDB schemas (Blog, Category)
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   ├── controllers/       # Business logic
│   └── utils/             # Helper functions
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── server.js              # Application entry point
```

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Slugify** - URL slug generation
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

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

### 3. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

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

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

### Using the Token
Include the token in the Authorization header for protected endpoints:

```bash
Authorization: Bearer <your-token>
```

## 🌐 Deployment

### Railway Deployment

1. **Create a MongoDB Atlas database** (free tier available)
   - Get your connection string

2. **Deploy to Railway**:
   - Connect your GitHub repository
   - Railway will auto-detect Node.js
   - Set environment variables in Railway dashboard:
     ```
     MONGODB_URI=your-mongodb-atlas-uri
     JWT_SECRET=your-production-secret
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=your-secure-password
     PORT=5000
     FRONTEND_URL=https://your-frontend-domain.vercel.app
     NODE_ENV=production
     ```

3. **Deploy**: Railway will automatically deploy on push to main branch

### Render Deployment

1. Create new Web Service
2. Connect your repository
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables
5. Deploy

### VPS/Cloud Server

1. **Setup MongoDB** on your server or use MongoDB Atlas

2. **Clone repository**:
   ```bash
   git clone your-repo-url
   cd blog-backend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure environment**:
   ```bash
   # Create .env with production values
   nano .env
   ```

5. **Use PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start server.js --name blog-api
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx as reverse proxy** (optional)

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔧 Configuration

### Slug Generation Rules
- Automatically generated from blog title
- Converted to lowercase
- Special characters removed
- Spaces replaced with hyphens
- **Immutable after publishing** (prevents broken links)

### CORS Configuration
Update `FRONTEND_URL` in `.env` to allow requests from your frontend domain.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas, whitelist your IP address

### CORS Errors
- Verify `FRONTEND_URL` in `.env`
- Check CORS configuration in `server.js`

### Authentication Issues
- Ensure `JWT_SECRET` is set
- Check token expiration (default: 24h)
- Verify admin credentials in `.env`

## 📝 Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

### Database Seeding (Optional)
```bash
npm run seed
```

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Express.js and MongoDB**
