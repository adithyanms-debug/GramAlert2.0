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

        // EXTRA SECURITY: Verify user still exists in the correct DB table
        let result;
        if (decoded.type === 'superadmin') {
            result = await query('SELECT id, username, email, role FROM super_admins WHERE id = $1', [decoded.id]);
            // SuperAdmins have no panchayat_id — they see all data
        } else if (decoded.type === 'admin') {
            result = await query('SELECT id, username, email, role, panchayat_id FROM admins WHERE id = $1', [decoded.id]);
        } else {
            result = await query('SELECT id, username, email, panchayat_id FROM users WHERE id = $1', [decoded.id]);
            if (result.rows.length > 0) {
                result.rows[0].role = 'VILLAGER'; // Villagers don't have role in DB, set it manually
            }
        }

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'User no longer exists. Please log in again.' });
        }

        // Attach user payload to request
        req.user = result.rows[0];
        req.user.type = decoded.type; // Ensure type is always available

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
};
