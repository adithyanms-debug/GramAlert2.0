import { query } from '../config/db.js';

export const getAlerts = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT 
                al.*,
                COALESCE(ad.username, sa.username) as created_by_name,
                COALESCE(ad.role, sa.role) as created_by_role
            FROM alerts al
            LEFT JOIN admins ad ON al.created_by_admin_id = ad.id
            LEFT JOIN super_admins sa ON al.created_by_superadmin_id = sa.id
            ORDER BY al.created_at DESC
        `);
        // Map description → message for frontend compatibility
        const rows = result.rows.map(row => ({
            ...row,
            message: row.description
        }));
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const createAlert = async (req, res, next) => {
    try {
        const { title, description, message, category, severity } = req.body;
        const { id, type } = req.user;
        // Accept 'message' (frontend) or 'description' (API)
        const alertDescription = message || description;

        const alertCategory = category || 'General';
        let adminId = null;
        let superAdminId = null;

        if (type === 'superadmin') {
            superAdminId = id;
        } else {
            adminId = id;
        }

        const result = await query(
            'INSERT INTO alerts (title, message, description, category, severity, created_by_admin_id, created_by_superadmin_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, alertDescription, alertDescription, alertCategory, severity, adminId, superAdminId]
        );

        res.status(201).json({
            message: 'Alert created successfully',
            alert: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const updateAlert = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, message, category, severity } = req.body;
        // Accept 'message' (frontend) or 'description' (API)
        const alertDescription = message || description;

        // Check if alert exists
        const checkResult = await query('SELECT * FROM alerts WHERE id = $1', [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        const result = await query(
            `UPDATE alerts 
             SET title = COALESCE($1, title), 
                 message = COALESCE($2, message),
                 description = COALESCE($3, description), 
                 category = COALESCE($4, category), 
                 severity = COALESCE($5, severity),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $6 RETURNING *`,
            [title, alertDescription, alertDescription, category, severity, id]
        );

        res.json({
            success: true,
            message: 'Alert updated successfully',
            alert: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAlert = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query('DELETE FROM alerts WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        res.json({ message: 'Alert deleted successfully' });
    } catch (error) {
        next(error);
    }
};
