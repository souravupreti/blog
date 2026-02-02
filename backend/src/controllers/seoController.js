import Blog from '../models/Blog.js';
import Category from '../models/Category.js';

/**
 * Generate sitemap.xml
 * GET /api/sitemap.xml
 */
export const generateSitemap = async (req, res) => {
    try {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        // Get all published blogs
        const blogs = await Blog.find({ status: 'published' })
            .select('slug updatedAt')
            .sort({ updatedAt: -1 });

        // Get all categories
        const categories = await Category.find()
            .select('slug updatedAt')
            .sort({ updatedAt: -1 });

        // Build XML sitemap
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Add homepage
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>1.0</priority>\n';
        xml += '  </url>\n';

        // Add blog listing page
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/blog</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>0.9</priority>\n';
        xml += '  </url>\n';

        // Add about page
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/about</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';

        // Add all blog posts
        blogs.forEach((blog) => {
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/blog/${blog.slug}</loc>\n`;
            xml += `    <lastmod>${blog.updatedAt.toISOString()}</lastmod>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.8</priority>\n';
            xml += '  </url>\n';
        });

        // Add all category pages
        categories.forEach((category) => {
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/category/${category.slug}</loc>\n`;
            xml += `    <lastmod>${category.updatedAt.toISOString()}</lastmod>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.7</priority>\n';
            xml += '  </url>\n';
        });

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Generate sitemap error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating sitemap',
        });
    }
};

/**
 * Generate robots.txt
 * GET /api/robots.txt
 */
export const generateRobotsTxt = async (req, res) => {
    try {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        let robotsTxt = 'User-agent: *\n';
        robotsTxt += 'Allow: /\n';
        robotsTxt += 'Disallow: /admin/\n';
        robotsTxt += 'Disallow: /api/\n\n';
        robotsTxt += `Sitemap: ${baseUrl}/sitemap.xml\n`;

        res.header('Content-Type', 'text/plain');
        res.send(robotsTxt);
    } catch (error) {
        console.error('Generate robots.txt error:', error);
        res.status(500).send('Error generating robots.txt');
    }
};
