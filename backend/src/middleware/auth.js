import { verifyToken } from '../config/jwt.js';
import { query } from '../config/db.js';

export const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header missing or invalid' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        // EXTRA SECURITY: Verify user still exists in DB
        // This is crucial after a database reset or if a user is deleted
        const result = await query('SELECT id, role FROM users WHERE id = $1', [decoded.id]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'User no longer exists. Please log in again.' });
        }

        // Attach user payload to request
        req.user = result.rows[0];

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
};
