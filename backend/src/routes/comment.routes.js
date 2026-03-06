import express from 'express';
import { body, validationResult } from 'express-validator';
import { getComments, createComment } from '../controllers/comment.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true }); // Important if nested under /grievances/:id/comments

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) return next();
        res.status(400).json({ errors: errors.array() });
    };
};

router.use(auth);

router.get('/', getComments);

router.post('/', validate([
    body('comment').notEmpty().withMessage('Comment text is required'),
]), createComment);

export default router;
