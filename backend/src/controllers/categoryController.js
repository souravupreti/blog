import Category from '../models/Category.js';
import Blog from '../models/Blog.js';
import { generateSlug, generateUniqueSlug } from '../utils/slugify.js';

/**
 * Get all categories (Public)
 * GET /api/categories
 */
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('Get all categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
        });
    }
};

/**
 * Get category by slug with blogs (Public)
 * GET /api/categories/:slug
 */
export const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const category = await Category.findOne({ slug });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Get blogs in this category
        const blogs = await Blog.find({ category: category._id, status: 'published' })
            .populate('category', 'name slug')
            .sort({ publishedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-content');

        const count = await Blog.countDocuments({ category: category._id, status: 'published' });

        res.json({
            success: true,
            data: {
                category,
                blogs,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                total: count,
            },
        });
    } catch (error) {
        console.error('Get category by slug error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
        });
    }
};

/**
 * Create category (Admin)
 * POST /api/admin/categories
 */
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required',
            });
        }

        // Generate unique slug
        const baseSlug = generateSlug(name);
        const slug = await generateUniqueSlug(baseSlug, Category);

        const category = await Category.create({
            name,
            slug,
            description,
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category,
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message,
        });
    }
};

/**
 * Update category (Admin)
 * PUT /api/admin/categories/:id
 */
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // If name changed, regenerate slug
        if (name && name !== category.name) {
            const baseSlug = generateSlug(name);
            category.slug = await generateUniqueSlug(baseSlug, Category, id);
            category.name = name;
        }

        if (description !== undefined) {
            category.description = description;
        }

        await category.save();

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: category,
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating category',
        });
    }
};

/**
 * Delete category (Admin)
 * DELETE /api/admin/categories/:id
 */
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category has blogs
        const blogCount = await Blog.countDocuments({ category: id });

        if (blogCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category with ${blogCount} blog(s). Please reassign or delete the blogs first.`,
            });
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
        });
    }
};
