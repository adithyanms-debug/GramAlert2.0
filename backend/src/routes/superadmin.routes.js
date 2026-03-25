import express from 'express';
import { body } from 'express-validator';
import {
    getStats,
    getGrievanceStats,
    getAllAdmins,
    createAdmin,
    deleteAdmin,
    getSentimentStats
} from '../controllers/superadmin.controller.js';
import { auth } from '../middleware/auth.js';
import { isSuperAdmin } from '../middleware/roleGuard.js';
import { validationResult } from 'express-validator';

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

// All routes are protected by auth and isSuperAdmin
router.use(auth, isSuperAdmin);

router.get('/stats', getStats);
router.get('/grievance-stats', getGrievanceStats);
router.get('/admins', getAllAdmins);
router.get('/sentiment-stats', getSentimentStats);

router.post('/admins', validate([
    body('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().isString(),
]), createAdmin);

router.delete('/admins/:id', deleteAdmin);

export default router;
