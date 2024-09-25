
module.exports = (app) => {
  const usersController = require("../controllers/user.controller");
  const AuthController = require("../controllers/authentication.controller");
  const authenticateJWT = require('../middleware/Jwt_middleware'); 
  const Admin= require('../middleware/Admin_middleware');
  const hasPermission = require('../middleware/Role_Permissions_middleware');
  var router = require("express").Router();
  
 // Get all users
router.get('/users', usersController.getAllUsers);

// Add a new user
router.post('/users', usersController.addUser);

// Get user by ID
router.get('/users/:id', usersController.getUserById);

// Update user details by ID
router.put('/users/:id',authenticateJWT,Admin, usersController.updateUser);

// Accept user account by admin (after OTP verification)
router.put('/users/accept/:id',authenticateJWT,Admin, usersController.acceptUserAccount);

// Delete user by ID
router.delete('/users/:id',authenticateJWT,Admin, usersController.deleteUser);

// User Signup
router.post('/auth/register', AuthController.Signup);

// User Signin
router.post('/auth/login', AuthController.Signin);

// Request OTP
router.post('/auth/request-otp', AuthController.requestOTP);

// Verify OTP
router.post('/auth/verify-otp', AuthController.verifyOTP);
 
// Request OTP for Password Reset
router.post('/auth/forgot-password', AuthController.requestPasswordReset); 

 // Reset Password
router.post('/auth/reset-password', AuthController.resetPassword);

// Get the total number of active users and a monthly comparison percentage
router.get('/active-users/monthly-comparison', usersController.getActiveUsersComparison);

// Get the total number of pending users and a monthly comparison percentage
router.get('/pending-users/monthly-comparison', usersController.getPendingUsersComparison);

// get new signups and compare them monthly
router.get('/newly-registered-users-total-comparison', usersController.getRegistrationStats);

app.use("/api", router);
};
