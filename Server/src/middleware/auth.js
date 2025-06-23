const jwt = require('jsonwebtoken');
const db = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db('users').where({ id: decoded.id }).first();

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware - Error:', error.message);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

const adminAuth = async (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin rights required.' 
      });
    }
    next();
  });
};

const hostAuth = async (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'host' && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Host rights required.' 
      });
    }
    next();
  });
};

module.exports = { auth, adminAuth, hostAuth };
