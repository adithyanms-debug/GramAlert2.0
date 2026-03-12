import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';

export const getStats = async (req, res, next) => {
    try {
        const adminsCount = await query('SELECT COUNT(*) FROM admins');
        const grievancesCount = await query('SELECT COUNT(*) FROM grievances');
        const alertsCount = await query('SELECT COUNT(*) FROM alerts');

        res.json({
            totalAdmins: parseInt(adminsCount.rows[0].count),
            totalGrievances: parseInt(grievancesCount.rows[0].count),
            activeAlerts: parseInt(alertsCount.rows[0].count),
            uptime: "99.9%"
        });
    } catch (error) {
        next(error);
    }
};

export const getGrievanceStats = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT 
                category,
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'Received' OR status = 'In Progress') as pending,
                COUNT(*) FILTER (WHERE status = 'Resolved') as resolved
            FROM grievances
            GROUP BY category
        `);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const getAllAdmins = async (req, res, next) => {
    try {
        const result = await query('SELECT id, username, email, created_at FROM admins ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const createAdmin = async (req, res, next) => {
    try {
        const { username, email, password, phone, department, division } = req.body;
        const superAdminId = req.user.id;

        const normalizedEmail = email.toLowerCase();

        // Check if admin exists
        const adminExist = await query('SELECT id FROM admins WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)', [username, normalizedEmail]);
        if (adminExist.rows.length > 0) {
            return res.status(400).json({ message: 'Administrator already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert admin with creator link to super_admins
        const result = await query(
            'INSERT INTO admins (username, email, password, phone, role, department, division, created_by_superadmin_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, username, email',
            [username, normalizedEmail, hashedPassword, phone, 'ADMIN', department, division, superAdminId]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const deleteAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query('DELETE FROM admins WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        next(error);
    }
};
