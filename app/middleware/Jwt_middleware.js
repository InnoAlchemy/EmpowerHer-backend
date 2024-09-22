const jwt = require('jsonwebtoken');
const db = require("../models");
const User = db.users;
const Role = db.role; 

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.id }, include: [Role] });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Format user data
    req.user = {
      id: user.id,
      role_id: user.role_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      newsletter_subscribed: user.newsletter_subscribed,
      membership_role_id: user.membership_role_id,
      membership_updated_at: user.membership_updated_at,
      is_verified: user.is_verified,
      is_accepted: user.is_accepted,
      otp: user.otp,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: user.role 
    };

    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }

    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateJWT;
/**
 * 
This middleware function verifies JWT tokens for authentication.
 It checks for the presence of a token, validates it,
  attaches the decoded user information to the request,
   and handles errors related to token expiration or invalidity.
 */