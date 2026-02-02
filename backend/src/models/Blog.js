import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        excerpt: {
            type: String,
            maxlength: [300, 'Excerpt cannot exceed 300 characters'],
        },
        // SEO Fields
        metaTitle: {
            type: String,
            maxlength: [60, 'Meta title should be under 60 characters'],
        },
        metaDescription: {
            type: String,
            maxlength: [160, 'Meta description should be under 160 characters'],
        },
        keywords: {
            type: [String],
            default: [],
        },
        canonicalUrl: {
            type: String,
        },
        ogImage: {
            type: String,
            default: '/images/default-og.jpg',
        },
        // Category
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        // Status
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        },
        author: {
            type: String,
            default: 'Admin',
        },
        publishedAt: {
            type: Date,
        },
        // Slug immutability tracking
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to set publishedAt and prevent slug changes
blogSchema.pre('save', function (next) {
    // Set publishedAt when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
        this.isPublished = true;
    }

    // Prevent slug modification after first publish
    if (this.isPublished && this.isModified('slug') && !this.isNew) {
        const err = new Error('Slug cannot be modified after publishing');
        return next(err);
    }

    next();
});

// Virtual for full URL
blogSchema.virtual('url').get(function () {
    return `/blog/${this.slug}`;
});

// Ensure virtuals are included in JSON
blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
