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
const contractRoutes = require('./routes/contracts');
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced CORS configuration with debugging
app.use((req, res, next) => {
  // Log all requests for debugging
  console.log(`${req.method} ${req.url} - Origin: ${req.get('Origin')}`);
  next();
});

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Manual OPTIONS handler for better debugging
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.get('Origin'));
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

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
    status: 'Active',    endpoints: {
      health: '/health',
      auth: '/api/auth',
      properties: '/api/properties',
      users: '/api/users',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      payments: '/api/payments',
      contracts: '/api/contracts',
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
app.use('/api/contracts', contractRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/safety', safetyRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Handle port already in use error
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use`);
    console.log(`💡 Try running: npm run dev:kill`);
    console.log(`💡 Or kill the process manually:`);
    console.log(`   netstat -ano | findstr :${PORT}`);
    console.log(`   taskkill /f /pid [PID]`);
    process.exit(1);
  } else {
    throw err;
  }
});

module.exports = app;
