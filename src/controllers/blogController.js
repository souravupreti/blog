import Blog from '../models/Blog.js';
import Category from '../models/Category.js';
import { generateSlug, generateUniqueSlug } from '../utils/slugify.js';

/**
 * Get all published blogs (Public)
 * GET /api/blogs
 */
export const getAllBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search } = req.query;

        const query = { status: 'published' };

        // Filter by category if provided
        if (category) {
            const cat = await Category.findOne({ slug: category });
            if (cat) {
                query.category = cat._id;
            }
        }

        // Search in title and content
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }

        const blogs = await Blog.find(query)
            .populate('category', 'name slug')
            .sort({ publishedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-content'); // Exclude full content for listing

        const count = await Blog.countDocuments(query);

        res.json({
            success: true,
            data: blogs,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            total: count,
        });
    } catch (error) {
        console.error('Get all blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blogs',
        });
    }
};

/**
 * Get single blog by slug (Public)
 * GET /api/blogs/:slug
 */
export const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const blog = await Blog.findOne({ slug, status: 'published' })
            .populate('category', 'name slug');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        res.json({
            success: true,
            data: blog,
        });
    } catch (error) {
        console.error('Get blog by slug error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blog',
        });
    }
};

/**
 * Get all blogs including drafts (Admin)
 * GET /api/admin/blogs
 */
export const getAllBlogsAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, category } = req.query;

        const query = {};

        if (status) {
            query.status = status;
        }

        if (category) {
            const cat = await Category.findOne({ slug: category });
            if (cat) {
                query.category = cat._id;
            }
        }

        const blogs = await Blog.find(query)
            .populate('category', 'name slug')
            .sort({ updatedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Blog.countDocuments(query);

        res.json({
            success: true,
            data: blogs,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            total: count,
        });
    } catch (error) {
        console.error('Get all blogs admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blogs',
        });
    }
};

/**
 * Create new blog (Admin)
 * POST /api/admin/blogs
 */
export const createBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            excerpt,
            metaTitle,
            metaDescription,
            keywords,
            canonicalUrl,
            ogImage,
            category,
            status,
        } = req.body;

        // Validate required fields
        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title, content, and category are required',
            });
        }

        // Verify category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category',
            });
        }

        // Generate unique slug from title
        const baseSlug = generateSlug(title);
        const slug = await generateUniqueSlug(baseSlug, Blog);

        // Create blog
        const blog = await Blog.create({
            title,
            slug,
            content,
            excerpt: excerpt || content.substring(0, 200) + '...',
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || excerpt || content.substring(0, 160),
            keywords: keywords || [],
            canonicalUrl,
            ogImage,
            category,
            status: status || 'draft',
            author: req.admin.username,
        });

        const populatedBlog = await Blog.findById(blog._id).populate('category', 'name slug');

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: populatedBlog,
        });
    } catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating blog',
            error: error.message,
        });
    }
};

/**
 * Update blog (Admin)
 * PUT /api/admin/blogs/:id
 */
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        // Prevent slug modification if already published
        if (blog.isPublished && updateData.slug && updateData.slug !== blog.slug) {
            return res.status(400).json({
                success: false,
                message: 'Cannot modify slug of published blog',
            });
        }

        // If title changed and not published, regenerate slug
        if (updateData.title && updateData.title !== blog.title && !blog.isPublished) {
            const baseSlug = generateSlug(updateData.title);
            updateData.slug = await generateUniqueSlug(baseSlug, Blog, id);
        }

        // Update blog
        Object.assign(blog, updateData);
        await blog.save();

        const updatedBlog = await Blog.findById(id).populate('category', 'name slug');

        res.json({
            success: true,
            message: 'Blog updated successfully',
            data: updatedBlog,
        });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating blog',
            error: error.message,
        });
    }
};

/**
 * Delete blog (Admin)
 * DELETE /api/admin/blogs/:id
 */
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        res.json({
            success: true,
            message: 'Blog deleted successfully',
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting blog',
        });
    }
};

/**
 * Get blog by ID (Admin)
 * GET /api/admin/blogs/:id
 */
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id).populate('category', 'name slug');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        res.json({
            success: true,
            data: blog,
        });
    } catch (error) {
        console.error('Get blog by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blog',
        });
    }
};
