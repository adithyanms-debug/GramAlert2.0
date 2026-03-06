import { query } from '../config/db.js';

export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await query(
            'SELECT id, username, email, phone, role, created_at as joinedDate FROM users WHERE id = $1',
            [userId]
        );

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
        const userId = req.user.id;
        const { phone, email } = req.body;

        // Check if new email belongs to someone else
        if (email) {
            const emailCheck = await query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
            if (emailCheck.rows.length > 0) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        const updates = [];
        const values = [];
        let queryIndex = 1;

        if (phone !== undefined) {
            updates.push(`phone = $${queryIndex++}`);
            values.push(phone);
        }

        if (email !== undefined) {
            updates.push(`email = $${queryIndex++}`);
            values.push(email);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(userId); // the last var is the ID
        const queryString = `UPDATE users SET ${updates.join(', ')} WHERE id = $${queryIndex} RETURNING id, username, email, phone, role`;

        const result = await query(queryString, values);

        res.json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};
