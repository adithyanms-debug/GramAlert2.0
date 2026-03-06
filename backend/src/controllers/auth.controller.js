import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { generateToken } from '../config/jwt.js';

export const register = async (req, res, next) => {
    try {
        const { username, password, email, phone } = req.body;

        // Check if user exists
        const userExist = await query('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Default role for self-registration
        const role = 'VILLAGER';

        // Insert user
        const result = await query(
            'INSERT INTO users (username, password, email, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role',
            [username, hashedPassword, email, phone, role]
        );

        const user = result.rows[0];

        // Generate Token
        const token = generateToken({ id: user.id, username: user.username, role: user.role });

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
        const { username, password } = req.body;

        // Find user by username
        const result = await query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate Token
        const token = generateToken({ id: user.id, username: user.username, role: user.role });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};
