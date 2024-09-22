const isAdmin = (req, res, next) => {
  // Ensure the user is logged in and has the admin role
  if (!req.user) {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }

  if (req.user.role.name !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }

  next();
};

module.exports = isAdmin;



/**
 * This middleware function checks if a user is logged in and has an admin role.
 * It denies access with a 403 status if the conditions are not met and proceeds to the next middleware if they are.
 */