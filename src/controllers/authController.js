import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Admin login controller
 */
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username and password',
            });
        }

        // Check credentials against environment variables
        const isValidUsername = username === process.env.ADMIN_USERNAME;
        const isValidPassword = password === process.env.ADMIN_PASSWORD;

        if (!isValidUsername || !isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                username,
                role: 'admin',
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
        });
    }
};

/**
 * Verify token and get admin info
 */
export const verifyToken = async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.admin,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
