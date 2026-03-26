import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import authRoutes from './src/routes/auth.routes.js';
import grievanceRoutes from './src/routes/grievance.routes.js';
import alertRoutes from './src/routes/alert.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import userRoutes from './src/routes/user.routes.js';
import superAdminRoutes from './src/routes/superadmin.routes.js';
import escalationRoutes from './src/routes/escalation.routes.js';
import panchayatRoutes from './src/routes/panchayat.routes.js';

// Import Middleware & Services
import { errorHandler } from './src/middleware/errorHandler.js';
import { initEscalationCron } from './src/services/escalation.service.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Security and utility Middlewares
app.use(helmet({
    crossOriginResourcePolicy: false, // Allows images to be served via static
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check for Render
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Static folder for frontend
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/grievances/:id/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/escalations', escalationRoutes);
app.use('/api/panchayats', panchayatRoutes);

// Catch-all: If no routes matched, and not an API request, serve index.html
app.use((req, res, next) => {
    // If the request is for an API route that doesn't exist, return 404
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} and bound to 0.0.0.0`);
    // Initialize Cron Jobs
    initEscalationCron();
});
