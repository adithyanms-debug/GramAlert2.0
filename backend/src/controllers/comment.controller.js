import { query } from '../config/db.js';

export const getComments = async (req, res, next) => {
    try {
        const { id } = req.params; // grievance_id
        const result = await query(
            `SELECT c.id, c.comment, c.created_at, u.username, u.role
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.grievance_id = $1
       ORDER BY c.created_at ASC`,
            [id]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const createComment = async (req, res, next) => {
    try {
        const { id } = req.params; // grievance_id
        const { comment } = req.body;
        const userId = req.user.id;

        // Optional: Check if grievance exists and if user has access to it
        // For now, assuming anyone authenticated can comment, or we can enforce villagers only comment on their own
        if (req.user.role === 'VILLAGER') {
            const accessCheck = await query('SELECT id FROM grievances WHERE id = $1 AND user_id = $2', [id, userId]);
            if (accessCheck.rows.length === 0) {
                return res.status(403).json({ message: 'Forbidden: You can only comment on your own grievances' });
            }
        }

        const result = await query(
            'INSERT INTO comments (grievance_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *',
            [id, userId, comment]
        );

        res.status(201).json({
            message: 'Comment added successfully',
            comment: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};
