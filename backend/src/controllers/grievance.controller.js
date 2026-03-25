import { query } from '../config/db.js';
import { determineSeverity, calculatePriority } from '../utils/priorityEngine.js';

export const getGrievances = async (req, res, next) => {
    try {
        const { status, category, priority } = req.query;
        const userId = req.user.id;
        const userRole = req.user.role;
        const panchayatId = req.user.panchayat_id;

        let baseQuery = `
            SELECT g.*, u.username as submitted_by,
                   (SELECT COUNT(*) FROM grievance_upvotes u WHERE u.grievance_id = g.id) AS upvote_count,
                   EXISTS(SELECT 1 FROM grievance_upvotes u WHERE u.grievance_id = g.id AND u.user_id = $1) AS has_upvoted
            FROM grievances g 
            JOIN users u ON g.user_id = u.id 
            WHERE 1=1
        `;
        const values = [userId];
        let idx = 2;

        // Panchayat isolation: Admin sees only their panchayat, SuperAdmin sees all
        if (userRole !== 'SUPERADMIN' && panchayatId) {
            baseQuery += ` AND g.panchayat_id = $${idx++}`;
            values.push(panchayatId);
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
            baseQuery += ` AND g.severity = $${idx++}`;
            values.push(priority);
        }

        const { sort } = req.query;
        if (sort === 'priority') {
            baseQuery += ' ORDER BY g.priority_score DESC';
        } else {
            baseQuery += ' ORDER BY g.created_at DESC';
        }

        const result = await query(baseQuery, values);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const getMyGrievances = async (req, res, next) => {
    try {
        const { status, category, priority } = req.query;
        const userId = req.user.id;
        const panchayatId = req.user.panchayat_id;

        let baseQuery = `
            SELECT g.*, u.username as submitted_by,
                   (SELECT COUNT(*) FROM grievance_upvotes u WHERE u.grievance_id = g.id) AS upvote_count,
                   EXISTS(SELECT 1 FROM grievance_upvotes u WHERE u.grievance_id = g.id AND u.user_id = $1) AS has_upvoted
            FROM grievances g 
            JOIN users u ON g.user_id = u.id 
            WHERE g.user_id = $2
        `;
        const values = [userId, userId];
        let idx = 3;

        // Strict isolation: ensure user only sees grievances from their assigned panchayat
        if (panchayatId) {
            baseQuery += ` AND g.panchayat_id = $${idx++}`;
            values.push(panchayatId);
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
            baseQuery += ` AND g.severity = $${idx++}`;
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

        const result = await query(
            `SELECT g.*, 
                   (SELECT COUNT(*) FROM grievance_upvotes u WHERE u.grievance_id = g.id) AS upvote_count,
                   EXISTS(SELECT 1 FROM grievance_upvotes u WHERE u.grievance_id = g.id AND u.user_id = $2) AS has_upvoted
             FROM grievances g WHERE id = $1`, 
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        const grievance = result.rows[0];

        // Cross-panchayat isolation check
        if (role !== 'SUPERADMIN' && req.user.panchayat_id && grievance.panchayat_id !== req.user.panchayat_id) {
            return res.status(403).json({ message: 'Access denied (cross-panchayat)' });
        }

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
                COALESCE(comments_a.role, sa.role, 'VILLAGER') as role
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
        const panchayatId = req.user.panchayat_id;

        let file_url = null;
        if (req.file) {
            // Assuming multer dest is 'uploads/', relative path
            file_url = `/uploads/${req.file.filename}`;
        }

        // Determine severity and priority score
        const severity = determineSeverity(title, description, category);
        const priority_score = calculatePriority(severity, 0);

        // Note: deadline is auto-calculated by trigger on insert
        const result = await query(
            `INSERT INTO grievances (title, description, category, user_id, latitude, longitude, file_url, severity, priority_score, panchayat_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [title, description, category, userId, latitude || null, longitude || null, file_url, severity, priority_score, panchayatId]
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
        const panchayatId = req.user.panchayat_id;
        const role = req.user.role;

        let overdueQuery = 'SELECT * FROM grievances WHERE is_overdue = TRUE';
        const values = [];

        // Panchayat isolation: non-superadmin sees only their panchayat
        if (role !== 'SUPERADMIN' && panchayatId) {
            overdueQuery += ' AND panchayat_id = $1';
            values.push(panchayatId);
        }

        overdueQuery += ' ORDER BY deadline ASC';

        const result = await query(overdueQuery, values);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const updateGrievance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, category, latitude, longitude } = req.body;
        const userId = req.user.id;

        // Fetch grievance and check ownership
        const grievanceResult = await query('SELECT * FROM grievances WHERE id = $1', [id]);
        if (grievanceResult.rows.length === 0) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        const grievance = grievanceResult.rows[0];

        // Cross-panchayat isolation check
        if (req.user.role !== 'SUPERADMIN' && req.user.panchayat_id && grievance.panchayat_id !== req.user.panchayat_id) {
            return res.status(403).json({ message: 'Forbidden: cross-panchayat access' });
        }

        if (grievance.user_id != userId) {
            return res.status(403).json({ message: 'Forbidden: You do not own this grievance' });
        }

        // Check status permission (allow only if Pending or Received)
        if (!['Pending', 'Received'].includes(grievance.status)) {
            return res.status(403).json({ message: 'Editing not allowed after processing begins' });
        }

        // Recalculate severity if content changed
        const severity = determineSeverity(title || grievance.title, description || grievance.description, category || grievance.category);

        let file_url = grievance.file_url;
        if (req.file) {
            file_url = `/uploads/${req.file.filename}`;
        }

        const result = await query(
            `UPDATE grievances 
             SET title = $1, description = $2, category = $3, latitude = $4, longitude = $5, severity = $6, file_url = $7, updated_at = CURRENT_TIMESTAMP
             WHERE id = $8 RETURNING *`,
            [
                title || grievance.title,
                description || grievance.description,
                category || grievance.category,
                latitude !== undefined ? latitude : grievance.latitude,
                longitude !== undefined ? longitude : grievance.longitude,
                severity,
                file_url,
                id
            ]
        );

        res.json({
            message: 'Grievance updated successfully',
            grievance: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const deleteGrievance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        // Fetch grievance and check ownership if villager
        const grievanceResult = await query('SELECT * FROM grievances WHERE id = $1', [id]);
        if (grievanceResult.rows.length === 0) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        const grievance = grievanceResult.rows[0];

        // Cross-panchayat isolation check
        if (role !== 'SUPERADMIN' && req.user.panchayat_id && grievance.panchayat_id !== req.user.panchayat_id) {
            return res.status(403).json({ message: 'Forbidden: cross-panchayat access' });
        }

        // Authorization logic
        if (role === 'VILLAGER') {
            if (grievance.user_id != userId) {
                return res.status(403).json({ message: 'Forbidden: You do not own this grievance' });
            }
            // Villagers can only delete if status is 'Pending'
            if (grievance.status !== 'Pending') {
                return res.status(403).json({ message: 'Deleting not allowed for processed grievances' });
            }
        } else if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
            return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }

        await query('DELETE FROM grievances WHERE id = $1', [id]);

        res.json({ message: 'Grievance deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const toggleUpvote = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Check if vote exists
        const voteExist = await query(
            'SELECT id FROM grievance_upvotes WHERE grievance_id = $1 AND user_id = $2',
            [id, userId]
        );

        let upvoted = false;

        if (voteExist.rows.length > 0) {
            // Remove vote
            await query(
                'DELETE FROM grievance_upvotes WHERE grievance_id = $1 AND user_id = $2',
                [id, userId]
            );
        } else {
            // Insert vote
            await query(
                'INSERT INTO grievance_upvotes (grievance_id, user_id) VALUES ($1, $2)',
                [id, userId]
            );
            upvoted = true;
        }

        // Return updated vote count
        const countResult = await query(
            'SELECT COUNT(*) AS upvote_count FROM grievance_upvotes WHERE grievance_id = $1',
            [id]
        );
        const upvote_count = parseInt(countResult.rows[0].upvote_count, 10);

        // DB triggers now handle recalculating priority score automatically after upvote insertion/deletion.

        res.json({
            upvoted,
            upvote_count: upvote_count
        });
    } catch (error) {
        next(error);
    }
};
