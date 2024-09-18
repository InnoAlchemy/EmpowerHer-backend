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

// Set port and listen for requests
const PORT = process.env.PORT || 8080; // Default to 8080 if PORT is not set
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
