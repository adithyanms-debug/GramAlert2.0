import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { generateToken } from '../config/jwt.js';

export const register = async (req, res, next) => {
    try {
        const { username, password, email, phone } = req.body;

        // Check if user exists in users table (Villagers)
        const userExist = await query('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user (Always VILLAGER for self-registration)
        const result = await query(
            'INSERT INTO users (username, password, email, phone) VALUES ($1, $2, $3, $4) RETURNING id, username, email',
            [username, hashedPassword, email, phone]
        );

        const user = result.rows[0];
        user.role = 'VILLAGER'; // Explicitly set for token

        // Generate Token
        const token = generateToken({ id: user.id, username: user.username, role: user.role, type: 'villager' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password, type } = req.body; // type: 'villager' or 'admin'

        let result;
        let role;

        if (type === 'superadmin') {
            result = await query('SELECT * FROM super_admins WHERE username = $1 OR email = $1', [username]);
        } else if (type === 'admin') {
            result = await query('SELECT * FROM admins WHERE username = $1 OR email = $1', [username]);
        } else {
            result = await query('SELECT * FROM users WHERE username = $1 OR email = $1', [username]);
            role = 'VILLAGER';
        }

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        role = role || user.role;

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate Token
        const token = generateToken({ id: user.id, username: user.username, role: role, type: type });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: role
            }
        });
    } catch (error) {
        next(error);
    }
};
