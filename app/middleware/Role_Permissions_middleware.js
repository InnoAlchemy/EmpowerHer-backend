const db = require("../models");
const User = db.users;
const Role = db.role;

const hasPermission = (requiredAction) => {
  return async (req, res, next) => {
    const userId = req.user.id;  // req.user is populated by JWT middleware

    try {
      const user = await User.findByPk(userId, {
        include: Role  // Include the role associated with the user
      });

      if (!user) {
        return res.status(403).json({ message: 'Access denied' });
      }


      // Parse the permissions field
      const permissions = JSON.parse(user.role.permissions);

      // Check if the user's role contains the required permission
      const userHasPermission = permissions[requiredAction];

      if (userHasPermission) {
        next();  // User has the required permission
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
