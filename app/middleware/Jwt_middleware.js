const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach decoded user info to request object
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
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