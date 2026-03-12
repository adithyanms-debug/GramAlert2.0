import { query } from '../config/db.js';
import { calculatePriority } from '../utils/priorityEngine.js';

export const getGrievances = async (req, res, next) => {
    try {
        const { status, category, priority } = req.query;
        const userId = req.user.id;
        const role = req.user.role;

        let baseQuery = `
            SELECT g.*, u.username as submitted_by 
            FROM grievances g 
            JOIN users u ON g.user_id = u.id 
            WHERE 1=1
        `;
        const values = [];
        let idx = 1;

        // Villagers only see their own
        if (role === 'VILLAGER') {
            baseQuery += ` AND g.user_id = $${idx++}`;
            values.push(userId);
        }

        if (status) {
            baseQuery += ` AND g.status = $${idx++}`;
            values.push(status);
        }

        if (category) {
            baseQuery += ` AND g.category = $${idx++}`;
            values.push(category);
        }

        if (priority) {
            baseQuery += ` AND g.priority = $${idx++}`;
            values.push(priority);
        }

        baseQuery += ' ORDER BY g.created_at DESC';

        const result = await query(baseQuery, values);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const getGrievanceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        const result = await query('SELECT * FROM grievances WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        const grievance = result.rows[0];

        // Access check
        if (role === 'VILLAGER' && grievance.user_id !== userId) {
            return res.status(403).json({ message: 'Forbidden: You do not have access to this grievance' });
        }

        // Fetch comments
        const commentsResult = await query(
            `SELECT 
                c.id, 
                c.comment, 
                c.created_at, 
                COALESCE(comments_u.username, comments_a.username, sa.username) as username,
                COALESCE(comments_u.role, comments_a.role, sa.role, 'VILLAGER') as role
            FROM comments c
            LEFT JOIN users comments_u ON c.user_id = comments_u.id
            LEFT JOIN admins comments_a ON c.admin_id = comments_a.id
            LEFT JOIN super_admins sa ON c.super_admin_id = sa.id
            WHERE c.grievance_id = $1
            ORDER BY c.created_at ASC`,
            [id]
        );

        grievance.comments = commentsResult.rows;

        res.json(grievance);
    } catch (error) {
        next(error);
    }
};

export const createGrievance = async (req, res, next) => {
    try {
        const { title, description, category, latitude, longitude } = req.body;
        const userId = req.user.id;

        let file_url = null;
        if (req.file) {
            // Assuming multer dest is 'uploads/', relative path
            file_url = `/uploads/${req.file.filename}`;
        }

        // Determine priority
        const priority = calculatePriority(title, description, category);

        // Note: deadline is auto-calculated by trigger on insert
        const result = await query(
            `INSERT INTO grievances (title, description, category, priority, user_id, latitude, longitude, file_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [title, description, category, priority, userId, latitude || null, longitude || null, file_url]
        );

        res.status(201).json({
            message: 'Grievance submitted successfully',
            grievance: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        let updateQuery = 'UPDATE grievances SET status = $1';
        const values = [status, id];

        if (status === 'Resolved') {
            updateQuery += ', resolved_at = CURRENT_TIMESTAMP';
        }

        updateQuery += ' WHERE id = $2 RETURNING *';

        const result = await query(updateQuery, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        res.json({
            message: 'Grievance status updated successfully',
            grievance: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const getOverdueGrievances = async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM grievances WHERE is_overdue = TRUE ORDER BY deadline ASC');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const deleteGrievance = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query('DELETE FROM grievances WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        res.json({ message: 'Grievance deleted successfully' });
    } catch (error) {
        next(error);
    }
};
