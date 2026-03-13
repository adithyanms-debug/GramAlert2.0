import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import authRoutes from './src/routes/auth.routes.js';
import grievanceRoutes from './src/routes/grievance.routes.js';
import alertRoutes from './src/routes/alert.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import userRoutes from './src/routes/user.routes.js';
import superAdminRoutes from './src/routes/superadmin.routes.js';

// Import Middleware & Services
import { errorHandler } from './src/middleware/errorHandler.js';
import { initEscalationCron } from './src/services/escalation.service.js';

dotenv.config();
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/grievances/:id/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/superadmin', superAdminRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to GramAlert API' });
});

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Initialize Cron Jobs
    initEscalationCron();
});
