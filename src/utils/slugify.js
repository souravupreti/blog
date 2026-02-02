import slugify from 'slugify';

/**
 * Generate a URL-friendly slug from text
 * @param {string} text - Text to slugify
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (text) => {
    return slugify(text, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
    });
};

/**
 * Generate a unique slug by appending a number if needed
 * @param {string} baseSlug - Base slug to make unique
 * @param {Model} Model - Mongoose model to check against
 * @param {string} excludeId - ID to exclude from uniqueness check (for updates)
 * @returns {Promise<string>} - Unique slug
 */
export const generateUniqueSlug = async (baseSlug, Model, excludeId = null) => {
    let slug = baseSlug;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
        const query = { slug };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const existing = await Model.findOne(query);

        if (!existing) {
            isUnique = true;
        } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }

    return slug;
};
