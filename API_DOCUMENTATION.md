# API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

## Authentication

Admin endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Public Endpoints

### Get All Blogs

**GET** `/blogs`

Get all published blog posts with pagination.

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10)
- `category` (string, optional) - Filter by category slug
- `search` (string, optional) - Search in title and content

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Blog Title",
      "slug": "blog-title",
      "excerpt": "Brief description...",
      "category": {
        "_id": "...",
        "name": "Technology",
        "slug": "technology"
      },
      "author": "Admin",
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

---

### Get Single Blog

**GET** `/blogs/:slug`

Get a single published blog post by slug.

**Parameters:**
- `slug` (string) - Blog post slug

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Blog Title",
    "slug": "blog-title",
    "content": "# Full markdown content...",
    "excerpt": "Brief description...",
    "metaTitle": "SEO Title",
    "metaDescription": "SEO description",
    "keywords": ["seo", "blog"],
    "canonicalUrl": "https://example.com/blog/blog-title",
    "ogImage": "https://example.com/images/og.jpg",
    "category": {
      "_id": "...",
      "name": "Technology",
      "slug": "technology"
    },
    "status": "published",
    "author": "Admin",
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get All Categories

**GET** `/categories`

Get all categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Technology",
      "slug": "technology",
      "description": "Tech-related posts",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Category with Blogs

**GET** `/categories/:slug`

Get a category with its blog posts.

**Parameters:**
- `slug` (string) - Category slug

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "...",
      "name": "Technology",
      "slug": "technology",
      "description": "Tech-related posts"
    },
    "blogs": [...],
    "totalPages": 3,
    "currentPage": 1,
    "total": 25
  }
}
```

---

### Get Sitemap

**GET** `/sitemap.xml`

Generate XML sitemap with all published content.

**Response:** XML document

---

### Get Robots.txt

**GET** `/robots.txt`

Get robots.txt configuration.

**Response:** Plain text

---

## Authentication Endpoints

### Admin Login

**POST** `/auth/login`

Authenticate admin user and receive JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

---

## Admin Endpoints (Protected)

All admin endpoints require authentication.

### Verify Token

**GET** `/admin/verify`

Verify JWT token validity.

**Response:**
```json
{
  "success": true,
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

---

### Get All Blogs (Admin)

**GET** `/admin/blogs`

Get all blogs including drafts.

**Query Parameters:**
- `page` (number, optional)
- `limit` (number, optional)
- `status` (string, optional) - Filter by status ('draft' or 'published')
- `category` (string, optional) - Filter by category slug

**Response:** Same format as public blogs endpoint

---

### Get Blog by ID

**GET** `/admin/blogs/:id`

Get a single blog by ID (including drafts).

**Parameters:**
- `id` (string) - Blog MongoDB ObjectId

**Response:**
```json
{
  "success": true,
  "data": { /* Full blog object */ }
}
```

---

### Create Blog

**POST** `/admin/blogs`

Create a new blog post.

**Request Body:**
```json
{
  "title": "My New Blog Post",
  "content": "# Markdown content here...",
  "excerpt": "Brief description",
  "metaTitle": "SEO Title",
  "metaDescription": "SEO description",
  "keywords": ["keyword1", "keyword2"],
  "canonicalUrl": "https://example.com/blog/my-post",
  "ogImage": "https://example.com/images/og.jpg",
  "category": "category-id",
  "status": "draft"
}
```

**Required Fields:**
- `title`
- `content`
- `category`

**Response:**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": { /* Created blog object */ }
}
```

**Notes:**
- Slug is auto-generated from title
- If `excerpt` is empty, first 200 chars of content are used
- If `metaTitle` is empty, title is used
- If `metaDescription` is empty, excerpt is used

---

### Update Blog

**PUT** `/admin/blogs/:id`

Update an existing blog post.

**Parameters:**
- `id` (string) - Blog MongoDB ObjectId

**Request Body:** Same as Create Blog (all fields optional)

**Response:**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": { /* Updated blog object */ }
}
```

**Notes:**
- Slug cannot be modified after publishing
- If title changes on unpublished blog, slug is regenerated

---

### Delete Blog

**DELETE** `/admin/blogs/:id`

Delete a blog post.

**Parameters:**
- `id` (string) - Blog MongoDB ObjectId

**Response:**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

### Create Category

**POST** `/admin/categories`

Create a new category.

**Request Body:**
```json
{
  "name": "Technology",
  "description": "Tech-related posts"
}
```

**Required Fields:**
- `name`

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": { /* Created category object */ }
}
```

**Notes:**
- Slug is auto-generated from name
- Name must be unique

---

### Update Category

**PUT** `/admin/categories/:id`

Update an existing category.

**Parameters:**
- `id` (string) - Category MongoDB ObjectId

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": { /* Updated category object */ }
}
```

**Notes:**
- If name changes, slug is regenerated

---

### Delete Category

**DELETE** `/admin/categories/:id`

Delete a category.

**Parameters:**
- `id` (string) - Category MongoDB ObjectId

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error Response (if category has blogs):**
```json
{
  "success": false,
  "message": "Cannot delete category with 5 blog(s). Please reassign or delete the blogs first."
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production using packages like `express-rate-limit`.

---

## CORS

CORS is configured to allow requests from the frontend URL specified in `FRONTEND_URL` environment variable.

---

## Examples

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

**Get Blogs:**
```bash
curl http://localhost:5000/api/blogs?page=1&limit=10
```

**Create Blog (with auth):**
```bash
curl -X POST http://localhost:5000/api/admin/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Blog",
    "content": "# Hello World",
    "category": "CATEGORY_ID",
    "status": "published"
  }'
```

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Login
const login = async () => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username: 'admin',
    password: 'Admin@123'
  });
  return response.data.token;
};

// Get blogs
const getBlogs = async () => {
  const response = await axios.get(`${API_URL}/blogs`);
  return response.data;
};

// Create blog (authenticated)
const createBlog = async (token, blogData) => {
  const response = await axios.post(
    `${API_URL}/admin/blogs`,
    blogData,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};
```

---

**API Version:** 1.0.0  
**Last Updated:** 2024
