import { query } from '../config/db.js';

export const getProfile = async (req, res, next) => {
    try {
        const { id, type } = req.user;
        let result;

        if (type === 'superadmin') {
            result = await query('SELECT id, username, email, phone, role, created_at FROM super_admins WHERE id = $1', [id]);
        } else if (type === 'admin') {
            result = await query('SELECT id, username, email, phone, role, department, division, created_at FROM admins WHERE id = $1', [id]);
        } else {
            result = await query('SELECT id, username, email, phone, created_at FROM users WHERE id = $1', [id]);
            if (result.rows.length > 0) result.rows[0].role = 'VILLAGER';
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { id, type } = req.user;
        const { username, email, phone } = req.body;

        let result;
        if (type === 'superadmin') {
            result = await query(
                'UPDATE super_admins SET username = $1, email = $2, phone = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, username, email, phone',
                [username, email, phone, id]
            );
        } else if (type === 'admin') {
            result = await query(
                'UPDATE admins SET username = $1, email = $2, phone = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, username, email, phone',
                [username, email, phone, id]
            );
        } else {
            result = await query(
                'UPDATE users SET username = $1, email = $2, phone = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, username, email, phone',
                [username, email, phone, id]
            );
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const getVillagers = async (req, res, next) => {
    try {
        const result = await query('SELECT id, username, email, phone, created_at FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};
