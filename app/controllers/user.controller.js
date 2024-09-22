const db = require("../models");
const bcrypt = require('bcrypt');
const User = db.users;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
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

// Get all users with their roles
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: db.role,  // Assuming you have a Role model defined
       
      }]
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const { first_name, last_name, email, newsletter_subscribed, membership_role_id, membership_updated_at, password ,role_id} = req.body;

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

       // Generate OTP
       const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP

    // Create the new user
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      role_id,
      newsletter_subscribed,
      membership_role_id,
      membership_updated_at,
      otp,
      password: hashedPassword // Store hashed password
    });
     // Generate a JWT token (but user still needs to verify OTP)
     const token = jwt.sign({ id: newUser.id, role: newUser.role },JWT_SECRET, {
      expiresIn: "24h", // Token expires in 1 hour
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

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Error adding user', error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id,{
      include: [{
        model: db.role,  // Assuming you have a Role model defined
       
      }]
    });

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
