import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './src/routes/authRoutes.js';
import workspaceRoutes from './src/routes/workspaceRoutes.js';

// Import middlewares
import errorHandler from './src/middlewares/errorHandler.js';
import notFound from './src/middlewares/notFound.js';

const app = express();

// ─── SECURITY MIDDLEWARES ───────────────────────────
// 1. Helmet untuk secure HTTP headers
app.use(helmet());

// 2. Rate Limiting (Mencegah brute force/DoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Limit 100 request per IP
  message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.'
});
app.use('/api', limiter);

// 3. Prevent NoSQL Injection
app.use(mongoSanitize());

// 4. Prevent HTTP Parameter Pollution
app.use(hpp());

// 5. CORS Configuration
app.use(cors());

// ─── GLOBAL MIDDLEWARES ─────────────────────────────
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Logger — hanya di development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── ROUTES ─────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🚀 {{PROJECT_NAME}} SaaS API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      workspaces: '/api/workspaces',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);

// ─── ERROR HANDLING ─────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
