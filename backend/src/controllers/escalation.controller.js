import { query } from '../config/db.js';

/**
 * Get all escalations (admin/superadmin only)
 */
export const getAllEscalations = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT e.*, g.title as grievance_title, g.category, g.status as grievance_status, 
                   g.priority, g.deadline, u.username as submitted_by
            FROM escalations e
            JOIN grievances g ON e.grievance_id = g.id
            JOIN users u ON g.user_id = u.id
            ORDER BY e.escalated_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

/**
 * Get escalation history for a specific grievance
 */
export const getEscalationsByGrievance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await query(`
            SELECT e.* FROM escalations e
            WHERE e.grievance_id = $1
            ORDER BY e.escalation_level ASC
        `, [id]);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};
