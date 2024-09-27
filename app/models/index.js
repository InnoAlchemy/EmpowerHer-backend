const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.port,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.users = require("./user.model")(sequelize, Sequelize);
db.user_tools = require("./user_tool.model")(sequelize, Sequelize);
db.discover_her_content = require("./discover_her_content.model")(sequelize, Sequelize);
db.page = require("./page.model")(sequelize, Sequelize);
db.page_sections = require("./page_section.model")(sequelize, Sequelize);
db.events = require("./event.model")(sequelize, Sequelize);
db.coupons = require("./coupon.model")(sequelize, Sequelize);
db.memberships = require("./membership.model")(sequelize, Sequelize);
db.reserved_events = require("./reserved_event.model")(sequelize, Sequelize);
db.nomination_types = require("./nomination_type.model")(sequelize, Sequelize);
db.static_page=require("./static_page.model")(sequelize, Sequelize);
db.team_member=require("./team_member.model")(sequelize, Sequelize);
db.get_involved_program=require("./get_involved_program.model")(sequelize, Sequelize);
db.partnership_types=require("./partnership_type.model")(sequelize, Sequelize);
db.forms=require("./form.model")(sequelize, Sequelize);
db.information_contact=require("./information_contact.model")(sequelize, Sequelize);
db.role=require("./role.model")(sequelize, Sequelize);
db.permission=require("./permission.model")(sequelize, Sequelize);
db.role_permission=require("./role_permission.model.js")(sequelize, Sequelize);
db.tickets=require("./tickets.model")(sequelize, Sequelize);

// Associations

// User - UserTool association
db.users.hasMany(db.user_tools, { foreignKey: "user_id", onDelete: "CASCADE" });
db.user_tools.belongsTo(db.users, { foreignKey: "user_id" });

// User - Role association (A user has one role)
db.users.belongsTo(db.role, { foreignKey: "role_id", onDelete: "CASCADE" });
db.role.hasMany(db.users, { foreignKey: "role_id", onDelete: "CASCADE" });

// Role - Permission Many-to-Many association via RolePermission
db.role.belongsToMany(db.permission, { through: db.role_permission, foreignKey: 'role_id' });
db.permission.belongsToMany(db.role, { through: db.role_permission, foreignKey: 'permission_id' });

// RolePermission belongs to both Role and Permission
db.role_permission.belongsTo(db.role, { foreignKey: 'role_id' });
db.role_permission.belongsTo(db.permission, { foreignKey: 'permission_id' });

// User - Event association (User creates many events)
db.users.hasMany(db.events, { foreignKey: "user_id", onDelete: "CASCADE" });
db.events.belongsTo(db.users, { foreignKey: "user_id" });

// Event - Ticket association (An event has many tickets)
db.events.hasMany(db.tickets, { foreignKey: "event_id", onDelete: "CASCADE" });
db.tickets.belongsTo(db.events, { foreignKey: "event_id" });

// Event - ReservedEvent association (An event has many reservations)
db.events.hasMany(db.reserved_events, { foreignKey: "event_id", onDelete: "CASCADE" });
db.reserved_events.belongsTo(db.events, { foreignKey: "event_id" });

// User - ReservedEvent association (A user makes many reservations)
db.users.hasMany(db.reserved_events, { foreignKey: "user_id", onDelete: "CASCADE" });
db.reserved_events.belongsTo(db.users, { foreignKey: "user_id" });

// ReservedEvent - Ticket association (A reserved event may reserve one or more tickets)
db.reserved_events.hasMany(db.tickets, { foreignKey: "reserved_event_id", onDelete: "CASCADE" });
db.tickets.belongsTo(db.reserved_events, { foreignKey: "reserved_event_id" });

// Coupon - ReservedEvent association (Optional coupon usage in a reservation)
db.coupons.hasMany(db.reserved_events, { foreignKey: "coupon_used_id", onDelete: "CASCADE" });
db.reserved_events.belongsTo(db.coupons, { foreignKey: "coupon_used_id" });

// Page - PageSection association
db.page.hasMany(db.page_sections, { foreignKey: "page_id", onDelete: "CASCADE" });
db.page_sections.belongsTo(db.page, { foreignKey: "page_id" });

// DiscoverHerContent - UserTool association
db.discover_her_content.hasMany(db.user_tools, { foreignKey: "discover_her_id", onDelete: "CASCADE" });
db.user_tools.belongsTo(db.discover_her_content, { foreignKey: "discover_her_id" });

module.exports = db;
