import express from 'express';
import { body, validationResult } from 'express-validator';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import { auth } from '../middleware/auth.js';

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

router.get('/me', auth, getProfile);

router.patch('/me', auth, validate([
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('phone').optional().isString(),
]), updateProfile);

export default router;
