import express from 'express';
import multer from 'multer';
import path from 'path';
import { body, validationResult } from 'express-validator';
import {
    getGrievances,
    getGrievanceById,
    createGrievance,
    updateStatus,
    getOverdueGrievances,
    deleteGrievance
} from '../controllers/grievance.controller.js';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleGuard.js';

// Setup Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'grievance-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const router = express.Router();

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) return next();
        res.status(400).json({ errors: errors.array() });
    };
};

router.use(auth);

// Villager & Admin
router.get('/', getGrievances);
router.get('/:id', getGrievanceById);
router.post('/', upload.single('photo'), validate([
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
]), createGrievance);

// Admin Only
router.get('/admin/overdue', isAdmin, getOverdueGrievances);

router.patch('/:id/status', isAdmin, validate([
    body('status').isIn(['Pending', 'Received', 'In Progress', 'Resolved', 'Rejected']).withMessage('Invalid status'),
]), updateStatus);

router.delete('/:id', isAdmin, deleteGrievance);

export default router;
