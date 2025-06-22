const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const paymentRoutes = require('./routes/payments');
const companyRoutes = require('./routes/company');
const careerRoutes = require('./routes/careers');
const referralRoutes = require('./routes/referrals');
const safetyRoutes = require('./routes/safety');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'DevSquad API Server',
    version: '1.0.0',
    status: 'Active',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      properties: '/api/properties',      users: '/api/users',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      payments: '/api/payments',
      company: '/api/company',
      careers: '/api/careers',
      referrals: '/api/referrals',
      safety: '/api/safety'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/safety', safetyRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
