
module.exports = (app) => {
  const usersController = require("../controllers/user.controller");
  const authenticateJWT = require('../middleware/Jwt_middleware'); 
  const Admin= require('../middleware/Admin_middleware');
  var router = require("express").Router();
  
 // Get all users
router.get('/users', usersController.getAllUsers);

// Add a new user
router.post('/users', usersController.addUser);

// Get user by ID
router.get('/users/:id', usersController.getUserById);

// Update user details by ID
router.put('/users/:id',authenticateJWT,Admin, usersController.updateUser);

// Delete user by ID
router.delete('/users/:id',authenticateJWT,Admin, usersController.deleteUser);

// User Signup
router.post('/signup', usersController.Signup);

// User Signin
router.post('/signin', usersController.Signin);

// Verify OTP
router.post('/verify-otp', usersController.verifyOTP);

// Accept user account by admin (after OTP verification)
router.put('/users/:id/accept',authenticateJWT,Admin, usersController.acceptUserAccount);
 
// Request OTP for Password Reset
router.post('/password-reset/request', usersController.requestPasswordReset); 

 // Reset Password
router.post('/password-reset/reset', usersController.resetPassword);

  app.use("/api", router);
};
