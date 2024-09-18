const isAdmin = (req, res, next) => {
  // Check if user is logged in and has the admin role
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

module.exports = isAdmin;


/**
 * This middleware function checks if a user is logged in and has an admin role.
 * It denies access with a 403 status if the conditions are not met and proceeds to the next middleware if they are.
 */