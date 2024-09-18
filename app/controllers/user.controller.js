const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = db.users;
const Op = db.Sequelize.Op;
const crypto = require('crypto'); // For generating random OTPs
const transporter = require('../config/email.config');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; // Store this in an environment variable in production

// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation function
const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Sign Up Method
exports.Signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password, confirm_password, role } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP

    // Create the new user
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
      is_verified: false,
      is_accepted: false,
      otp,
    });

    // Generate a JWT token (but user still needs to verify OTP)
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Send OTP via email (simulated)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: 'Your OTP for Account Verification',
      text: `Hello ${newUser.first_name},\n\nYour OTP for verifying your account is: ${otp}.\n\nBest regards,\nYour Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ message: 'User created, but error sending OTP email.' });
      }

      // Respond with token and message to verify OTP
      res.status(201).json({
        message: 'User created! Please check your email for the OTP to verify your account.',
        token, // JWT token
      });
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Error during signup', error: error.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Check if the OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // Verify the user and clear the OTP
    user.is_verified = true;
    user.otp = null;
    await user.save();

    res.status(200).json({ message: 'Account verified successfully! You can now log in and access protected routes.' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};

// Sign In method
exports.Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Check if the user is verified
    if (!user.is_verified) {
      return res.status(400).json({ message: 'Your account is not verified. Please verify using the OTP sent to your email.' });
    }

    // Check if the user is accepted
    if (!user.is_accepted) {
      return res.status(400).json({ message: 'Your account has not been accepted by an admin.' });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate a JWT for protected routes
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.status(200).json({ message: 'Signed in successfully!', token });
  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ message: 'Error signing in', error: error.message });
  }
};

// Request OTP for Password Reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate OTP for password reset
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    user.otp = otp;
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your OTP for Password Reset',
      text: `Hello ${user.first_name},\n\nYour OTP for password reset is: ${otp}.\n\nBest regards,\nYour Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ message: 'Error sending OTP email.' });
      }

      res.status(200).json({ message: 'OTP sent successfully! Please check your email.' });
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Error requesting password reset', error: error.message });
  }
};

// Verify OTP and Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, new_password, confirm_password } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (!validatePassword(new_password)) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // Check if passwords match
    if (new_password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    user.otp = null; // Clear the OTP after reset
    await user.save();

    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};

// Accept User Account by Admin
exports.acceptUserAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { accept } = req.body; // true to accept, false to reject

    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user is already accepted or rejected
    if (user.is_accepted === true && accept === true) {
      return res.status(400).json({ message: 'User account is already accepted.' });
    }

    if (user.is_accepted === false && accept === false) {
      return res.status(400).json({ message: 'User account is already denied.' });
    }

    // Update the user's acceptance status based on admin action
    user.is_accepted = accept;
    await user.save();

    const message = accept
      ? 'User account accepted successfully!'
      : 'User account denied successfully!';
    res.status(200).json({ message });
  } catch (error) {
    console.error('Error updating user account:', error);
    res.status(500).json({ message: 'Error updating user account', error: error.message });
  }
};



// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const { first_name, last_name, email, newsletter_subscribed, membership_role_id, membership_updated_at, password } = req.body;

    // Validate input fields
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'First name, last name, email, and password are required.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      newsletter_subscribed,
      membership_role_id,
      membership_updated_at,
      password: hashedPassword // Store hashed password
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Error adding user', error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Update user details by ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      newsletter_subscribed,
      membership_role_id,
      membership_updated_at,
      password,
      role,
      is_verified,
      is_accepted,
      otp
    } = req.body;

    // Retrieve the existing user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate email if provided
    if (email !== undefined && !validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Validate password if provided
    if (password !== undefined && !validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check if the email already exists for other users (excluding the current user)
    if (email !== undefined) {
      const existingUser = await User.findOne({ where: { email, id: { [Op.ne]: id } } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use.' });
      }
    }

    // Update only the fields that are provided
    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (email !== undefined) user.email = email;
    if (newsletter_subscribed !== undefined) user.newsletter_subscribed = newsletter_subscribed;
    if (membership_role_id !== undefined) user.membership_role_id = membership_role_id;
    if (membership_updated_at !== undefined) user.membership_updated_at = membership_updated_at;
    if (password !== undefined) {
      // Hash the new password before saving
      user.password = await bcrypt.hash(password, 10);
    }
    if (role !== undefined) user.role = role;
    if (is_verified !== undefined) user.is_verified = is_verified;
    if (is_accepted !== undefined) user.is_accepted = is_accepted;
    if (otp !== undefined) user.otp = otp;

    // Save the updated user
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};


// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });

    if (deleted) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
