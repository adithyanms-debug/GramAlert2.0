import express from 'express';
import { getPanchayats, getPanchayatRankings } from '../controllers/panchayat.controller.js';

const router = express.Router();

router.get('/', getPanchayats);
router.get('/rankings', getPanchayatRankings);


export default router;
