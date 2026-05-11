const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Security middlewares
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// Import routes
const itemRoutes = require('./src/routes/itemRoutes');

// Import middlewares
const errorHandler = require('./src/middlewares/errorHandler');
const notFound = require('./src/middlewares/notFound');

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

// Logger — hanya di development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── ROUTES ─────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🚀 {{PROJECT_NAME}} API is running!',
    version: '1.0.0',
    endpoints: {
      items: '/api/items',
    },
  });
});

app.use('/api/items', itemRoutes);

// ─── ERROR HANDLING ─────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
