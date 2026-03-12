import { query } from '../config/db.js';

export const getComments = async (req, res, next) => {
    try {
        const { id: grievanceId } = req.params;
        const result = await query(`
            SELECT 
                c.*,
                COALESCE(u.username, a.username, sa.username) as username,
                COALESCE(a.role, sa.role, 'VILLAGER') as role
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            LEFT JOIN admins a ON c.admin_id = a.id
            LEFT JOIN super_admins sa ON c.super_admin_id = sa.id
            WHERE c.grievance_id = $1
            ORDER BY c.created_at ASC
        `, [grievanceId]);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const createComment = async (req, res, next) => {
    try {
        const { id: grievanceId } = req.params;
        const { comment } = req.body;
        const { id, type } = req.user;

        let user_id = null;
        let admin_id = null;
        let super_admin_id = null;

        if (type === 'superadmin') {
            super_admin_id = id;
        } else if (type === 'admin') {
            admin_id = id;
        } else {
            user_id = id;
        }

        const result = await query(
            'INSERT INTO comments (grievance_id, user_id, admin_id, super_admin_id, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [grievanceId, user_id, admin_id, super_admin_id, comment]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};
