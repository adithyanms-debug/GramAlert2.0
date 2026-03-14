import express from 'express';
import { body, validationResult } from 'express-validator';
import { getAlerts, createAlert, updateAlert, deleteAlert } from '../controllers/alert.controller.js';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleGuard.js';

const router = express.Router();

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) return next();
        res.status(400).json({ errors: errors.array() });
    };
};

// Public route (or auth if you prefer, user requested public no auth)
router.get('/', getAlerts);

// Admin only routes
router.use(auth, isAdmin);

router.post('/', validate([
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').optional(),
    body('severity').optional().isIn(['high', 'medium', 'low', 'info']),
]), createAlert);

router.patch('/:id', validate([
    body('title').optional().notEmpty(),
    body('description').optional().notEmpty(),
    body('category').optional(),
    body('severity').optional().isIn(['high', 'medium', 'low', 'info']),
]), updateAlert);

router.delete('/:id', deleteAlert);

export default router;
