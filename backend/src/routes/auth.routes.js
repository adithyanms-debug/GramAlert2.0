import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login } from '../controllers/auth.controller.js';

const router = express.Router();

// Validation middleware
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ errors: errors.array() });
    };
};

router.post('/register', validate([
    body('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]), register);

router.post('/login', validate([
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
]), login);

export default router;
