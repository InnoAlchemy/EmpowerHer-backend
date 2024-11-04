// server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
require("dotenv").config(); // Ensure dotenv is imported at the top

// Parse requests of content-type - application/json
app.use(express.json());
app.use(cors());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const db = require("./app/models");

db.sequelize
  .sync({
    // force: true, // Uncomment to drop and recreate tables
    // alter: true, // Uncomment to update tables
  })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

const server = http.createServer(app);

// Initialize Socket.io
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // Update this to your client's origin in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for user joining their room
  socket.on("joinRoom", (user_id) => {
    socket.join(`user_${user_id}`);
    console.log(`User ${user_id} joined room user_${user_id}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
// Make io accessible to controllers via app locals
app.locals.io = io;
// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to EmpowerHer Website." });
});

// Import routes
require("./app/routes/user.routes")(app);
require("./app/routes/coupons.routes")(app);
require("./app/routes/discover_her_content.routes")(app);
require("./app/routes/events.routes")(app);
require("./app/routes/reserved_events.routes")(app);
require("./app/routes/forms.routes")(app);
require("./app/routes/get_involved_programs.routes")(app);
require("./app/routes/information_contacts.routes")(app);
require("./app/routes/memberships.routes")(app);
require("./app/routes/nomination_types.routes")(app);
require("./app/routes/page.routes")(app);
require("./app/routes/page_sections.routes")(app);
require("./app/routes/partnership_types.routes")(app);
require("./app/routes/static_page.routes")(app);
require("./app/routes/team.routes")(app);
require("./app/routes/user_tools.routes")(app);
require("./app/routes/role.routes")(app);
require("./app/routes/permission.routes")(app);
require("./app/routes/role_permissions.routes")(app);
require("./app/routes/tickets.routes")(app);
require("./app/routes/combined_api_data_for_pages.routes")(app);
require("./app/routes/nomination_form.routes")(app);
require("./app/routes/partnership_form.routes")(app);
require("./app/routes/post.routes")(app);
require("./app/routes/chat.routes")(app);
require("./app/routes/notification.routes")(app);
require("./app/routes/likes.routes")(app);
require("./app/routes/comment.routes")(app);
require("./app/routes/share.routes")(app);
require("./app/routes/viewes.routes")(app);
// Set port and listen for requests
const PORT = process.env.PORT || 8080; // Default to 8080 if PORT is not set
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
