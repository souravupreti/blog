import express from 'express';
import { login, verifyToken } from '../controllers/authController.js';
import {
    getAllBlogs,
    getBlogBySlug,
    getAllBlogsAdmin,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
} from '../controllers/blogController.js';
import {
    getAllCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js';
import { generateSitemap, generateRobotsTxt } from '../controllers/seoController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// ============================================
// Public Routes
// ============================================

// Auth
router.post('/auth/login', login);

// Blogs
router.get('/blogs', getAllBlogs);
router.get('/blogs/:slug', getBlogBySlug);

// Categories
router.get('/categories', getAllCategories);
router.get('/categories/:slug', getCategoryBySlug);

// SEO
router.get('/sitemap.xml', generateSitemap);
router.get('/robots.txt', generateRobotsTxt);

// ============================================
// Admin Routes (Protected)
// ============================================

// Verify token
router.get('/admin/verify', authenticateAdmin, verifyToken);

// Blogs
router.get('/admin/blogs', authenticateAdmin, getAllBlogsAdmin);
router.get('/admin/blogs/:id', authenticateAdmin, getBlogById);
router.post('/admin/blogs', authenticateAdmin, createBlog);
router.put('/admin/blogs/:id', authenticateAdmin, updateBlog);
router.delete('/admin/blogs/:id', authenticateAdmin, deleteBlog);

// Categories
router.post('/admin/categories', authenticateAdmin, createCategory);
router.put('/admin/categories/:id', authenticateAdmin, updateCategory);
router.delete('/admin/categories/:id', authenticateAdmin, deleteCategory);

export default router;
