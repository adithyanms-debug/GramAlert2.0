import express from 'express';
import { getAllEscalations, getEscalationsByGrievance } from '../controllers/escalation.controller.js';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleGuard.js';

const router = express.Router();

router.use(auth);

// Get all escalations (admin/superadmin only)
router.get('/', isAdmin, getAllEscalations);

// Get escalation history for a specific grievance (any authenticated user)
router.get('/grievance/:id', getEscalationsByGrievance);

export default router;
