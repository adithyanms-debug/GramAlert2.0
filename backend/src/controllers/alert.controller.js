import { query } from '../config/db.js';

export const getAlerts = async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM alerts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const createAlert = async (req, res, next) => {
    try {
        const { title, description, category, severity } = req.body;
        const userId = req.user.id;

        const result = await query(
            'INSERT INTO alerts (title, description, category, severity, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, category, severity, userId]
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
        const { title, description, category, severity } = req.body;

        const result = await query(
            `UPDATE alerts 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           category = COALESCE($3, category), 
           severity = COALESCE($4, severity) 
       WHERE id = $5 RETURNING *`,
            [title, description, category, severity, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        res.json({
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
