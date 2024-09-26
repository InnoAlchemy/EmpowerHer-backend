const jwt = require('jsonwebtoken');
const db = require("../models");
const User = db.users;
const Role = db.role;
const Permission = db.permission;  // Include Permission model
const RolePermission = db.role_permission;  // Include RolePermission model

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

    // Fetch user with role and permissions
    const user = await User.findOne({
      where: { id: decoded.id },
      include: [
        {
          model: Role,
          include: [
            {
              model: Permission,  // Include permissions through role_permission
              through: { model: RolePermission }
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Attach user and role info to the request
    req.user = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,  // Include role with permissions
      permissions: user.role.permissions  // Attach permissions for later use
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