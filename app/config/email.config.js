/**
 * This file sets up a Nodemailer transporter for sending emails using configuration from environment variables.
 * It initializes the transporter with the email host, port, and authentication details.
 */
require("dotenv").config();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,// 465 for https
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Admin Gmail ID
    pass: process.env.EMAIL_PASS, // Admin Gmail Password
  },
});

module.exports = transporter;
