import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes - Ensure user is authenticated and session is valid
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // SENIOR LOGIC: Cek apakah token masih ada di database (Session check)
    // Jika user sudah logout, token akan dihapus dari array refreshTokens
    const user = await User.findOne({ 
      _id: decoded.id,
      'refreshTokens.token': token 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Session expired or logged out. Please login again.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

/**
 * Grant access to specific roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
