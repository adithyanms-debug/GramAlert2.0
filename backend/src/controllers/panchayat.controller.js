import { query } from '../config/db.js';

export const getPanchayats = async (req, res) => {
    try {
        const result = await query(
            "SELECT id, name, district FROM panchayats ORDER BY name"
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch panchayats' });
    }
};
