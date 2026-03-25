import express from 'express';
import { getPanchayats } from '../controllers/panchayat.controller.js';

const router = express.Router();

router.get('/', getPanchayats);

export default router;
