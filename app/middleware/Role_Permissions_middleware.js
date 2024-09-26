const db = require("../models");
const User = db.users;
const Role = db.role;
const Permission = db.permission;  // Include Permission model

const hasPermission = (requiredAction) => {
  return async (req, res, next) => {
    const user = req.user;  // User is populated by JWT middleware

    if (!user || !user.role || !user.role.permissions) {
      return res.status(403).json({ message: 'Access denied. No permissions found.' });
    }

    try {
      // Check if the user's role has the required permission
      const userHasPermission = user.role.permissions.some(permission => permission.name === requiredAction);

      if (userHasPermission) {
        next();  // User has the required permission, allow access
      } else {
        return res.status(403).json({ message: 'Access denied. You do not have permission to perform this action.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = hasPermission;
