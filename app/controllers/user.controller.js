const db = require("../models");
const { Sequelize } = db;
const bcrypt = require('bcrypt');
const User = db.users;
const Role=db.role;
const Permission = db.permission;  // Include the Permission model
const RolePermission = db.role_permission;  // Include the RolePermission model
const Membership = db.memberships;
const Op = db.Sequelize.Op;
const calculateComparisonPercentage = require('../Helper-Functions/helper_functions');
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
        model: Role,
          include: [
          {
            model: Permission,  // Include associated permissions
            through: { model: RolePermission },  // Include the RolePermission junction table
          },
        ],
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
    const { first_name, last_name, email, newsletter_subscribed, membership_role_id, membership_updated_at, password, status, role_id } = req.body;

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
      status,
      password: hashedPassword, // Store hashed password
    });

    // Generate a JWT token (but user still needs to verify OTP)
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
      expiresIn: '24h', // Token expires in 24 hours
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
        return res.status(500).json({ message: 'User created, but error sending OTP email.', error: error.message });
      }

      // Respond with token and message to verify OTP
      return res.status(201).json({
        message: 'User created! Please check your email for the OTP to verify your account.',
        token, // JWT token
      });
    });

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
        model: Role,
          include: [
          {
            model: Permission,  // Include associated permissions
            through: { model: RolePermission },  // Include the RolePermission junction table
          },
        ],
       
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
      status,
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
    if(status!==undefined) user.status = status;
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

    // If the user is accepted, update their status to 'active'
    if (accept === true) {
      user.status = 'active';
    }

    // Save the updated user details
    await user.save();

    const message = accept
      ? 'User account accepted and status updated to active!'
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

// Get the total number of active users and provide monthly comparison
exports.getActiveUsersComparison = async (req, res) => {
  try {
    // Get the total number of active users (accepted users)
    const totalActiveUsers = await User.count({
      where: { is_accepted: true }
    });

    // Get active users for the current month
    const currentMonth = new Date();
    const firstDayOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    const activeUsersCurrentMonth = await User.count({
      where: {
        is_accepted: true,
        updatedAt: { // Assuming 'updatedAt' is the field to check for user acceptance
          [Op.gte]: firstDayOfCurrentMonth
        }
      }
    });

    // Get active users for the previous month
    const firstDayOfLastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

    const activeUsersLastMonth = await User.count({
      where: {
        is_accepted: true,
        updatedAt: {
          [Op.between]: [firstDayOfLastMonth, lastDayOfLastMonth]
        }
      }
    });

    // Calculate percentage change
    let percentageChange = 0;

    if (activeUsersLastMonth === 0 && activeUsersCurrentMonth > 0) {
      percentageChange = "+100.00%"; // Set to +100% if there's an increase from 0
    } else if (activeUsersLastMonth > 0) {
      const change = ((activeUsersCurrentMonth - activeUsersLastMonth) / activeUsersLastMonth) * 100;
      const formattedChange = change.toFixed(2); // Round to 2 decimals
      percentageChange = (change > 0 ? `+${formattedChange}` : `${formattedChange}`) + "%";
    }

    // Format response
    res.status(200).json({
      TotalOfActiveUsers: totalActiveUsers,
      activeUsersCurrentMonth: activeUsersCurrentMonth,
      activeUsersLastMonth: activeUsersLastMonth,
      percentageChange: percentageChange
    });
  } catch (error) {
    console.error('Error fetching active users comparison:', error);
    res.status(500).json({ message: "Error fetching active users comparison", error });
  }
};


// Get the total number of pending users and provide monthly comparison
exports.getPendingUsersComparison = async (req, res) => {
  try {
    // Get the total number of pending users (users who are not accepted)
    const totalPendingUsers = await User.count({
      where: { is_accepted: false }
    });

    // Get pending users for the current month
    const currentMonth = new Date();
    const firstDayOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    const pendingUsersCurrentMonth = await User.findAll({
      where: {
        is_accepted: false,
        createdAt: {
          [Op.gte]: firstDayOfCurrentMonth
        }
      },
      attributes: [[Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'name'], 'email']
    });

    // Get pending users for the previous month
    const firstDayOfLastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

    const pendingUsersLastMonth = await User.count({
      where: {
        is_accepted: false,
        createdAt: {
          [Op.between]: [firstDayOfLastMonth, lastDayOfLastMonth]
        }
      }
    });

    // Calculate percentage change
    let percentageChange = 0;

    if (pendingUsersLastMonth === 0 && pendingUsersCurrentMonth.length > 0) {
      percentageChange = "+100.00%"; // Set to +100% if there's an increase from 0
    } else if (pendingUsersLastMonth > 0) {
      const change = ((pendingUsersCurrentMonth.length - pendingUsersLastMonth) / pendingUsersLastMonth) * 100;
      const formattedChange = change.toFixed(2); // Round to 2 decimals
      percentageChange = (change > 0 ? `+${formattedChange}` : `${formattedChange}`) + "%";
    }

    // Format response
    res.status(200).json({
      TotalOfPendingUsers: totalPendingUsers,
      pendingUsersCurrentMonth: pendingUsersCurrentMonth.length,
      pendingUsersCurrentMonthDetails: pendingUsersCurrentMonth.map(user => ({ name: user.dataValues.name, email: user.dataValues.email })),
      pendingUsersLastMonth: pendingUsersLastMonth,
      percentageChange: percentageChange
    });
  } catch (error) {
    console.error('Error fetching pending users comparison:', error);
    res.status(500).json({ message: "Error fetching pending users comparison", error });
  }
};
// Get total number of new registrations and percentage difference
exports.getRegistrationStats = async (req, res) =>  {
  try {
    // Fetch all users from the database
    const users = await User.findAll();

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    // Prepare the response object for all users
    const response = users.map((user) => {
      // Assume `user` contains user data including name, createdAt date, etc.
      const formattedDate = new Date(user.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        "name": user.first_name + ' ' + user.last_name, // Concatenate first name and last name
        "Date Registered": formattedDate,
      };
    });

    // Calculate total number of users
    const totalUsers = users.length;

    // Calculate percentage comparison between current month and previous month
    const comparison = await calculateComparisonPercentage();

    // Send the final response
    res.status(200).json({
      "total": totalUsers,
      "percentage of comparison between current month and previous month": comparison,
      "users": response, // Array of user info
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};
// Get user by email
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Assuming email is passed as a URL parameter

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          include: [
            {
              model: Permission,
              through: { model: RolePermission },
            },
          ],
        },
        {
          model: Membership,
        },
      ],
    });
    

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: 'Error fetching user by email', error: error.message });
  }
};

