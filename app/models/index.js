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
db.nomination_form = require("./nomination_form_model")(sequelize, Sequelize);
db.partnership_form = require("./partnership_form.model")(sequelize, Sequelize);
db.chats = require("./chat.model")(sequelize, Sequelize);
db.notifications = require("./notifications.model")(sequelize, Sequelize);
db.posts = require("./post.model")(sequelize, Sequelize);
db.comments = require("./comment.model")(sequelize, Sequelize);
db.likes = require("./like.model")(sequelize, Sequelize);
db.shares = require("./share.model")(sequelize, Sequelize);
db.viewed = require("./viewed.model")(sequelize, Sequelize);
db.organization = require("./organization.model")(sequelize, Sequelize);
// Associations

//User - Organization association

db.users.hasOne(db.organization, { foreignKey: "user_id", onDelete: "CASCADE" });
db.organization.belongsTo(db.users, { foreignKey: "user_id" });

// User - UserTool association
db.users.hasMany(db.user_tools, { foreignKey: "user_id", onDelete: "CASCADE" });
db.user_tools.belongsTo(db.users, { foreignKey: "user_id" });

// User - UserTool association
db.memberships.hasMany(db.users, { foreignKey: "membership_role_id", onDelete: "CASCADE" });
db.users.belongsTo(db.memberships, { foreignKey: "membership_role_id" });

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

// Nomination_Form - nomination_types association
db.nomination_types.hasMany(db.nomination_form, { foreignKey: "nomination_type_id", onDelete: "CASCADE" });
db.nomination_form.belongsTo(db.nomination_types, { foreignKey: "nomination_type_id" });

// PartnershipType - PartnershipForm association
db.partnership_types.hasMany(db.partnership_form, { foreignKey: "partnership_type_id", onDelete: "CASCADE" });
db.partnership_form.belongsTo(db.partnership_types, { foreignKey: "partnership_type_id", });




// User - Chat association (User can send and receive many chats)
db.users.hasMany(db.chats, { foreignKey: "sender_id", as: "sentChats", onDelete: "CASCADE" });
db.users.hasMany(db.chats, { foreignKey: "receiver_id", as: "receivedChats", onDelete: "CASCADE" });
db.chats.belongsTo(db.users, { foreignKey: "sender_id", as: "sender" });
db.chats.belongsTo(db.users, { foreignKey: "receiver_id", as: "receiver" });

// User - Notification association (User has many notifications)
db.users.hasMany(db.notifications, { foreignKey: "user_id", onDelete: "CASCADE" });
db.notifications.belongsTo(db.users, { foreignKey: "user_id" });

// Posts - Notification association (Posts has many notifications)
db.posts.hasMany(db.notifications, { foreignKey: "post_id", onDelete: "CASCADE" });
db.notifications.belongsTo(db.posts, { foreignKey: "post_id" });

// User - Post association (User creates many posts)
db.users.hasMany(db.posts, { foreignKey: "user_id", onDelete: "CASCADE" });
db.posts.belongsTo(db.users, { foreignKey: "user_id" });

// Post - Comment association (Post has many comments)
db.posts.hasMany(db.comments, { foreignKey: "post_id", onDelete: "CASCADE" });
db.comments.belongsTo(db.posts, { foreignKey: "post_id" });

// User - Comment association (User can create many comments)
db.users.hasMany(db.comments, { foreignKey: "user_id", onDelete: "CASCADE" });
db.comments.belongsTo(db.users, { foreignKey: "user_id" });

// Post - Like association (Post can have many likes)
db.posts.hasMany(db.likes, { foreignKey: "post_id", onDelete: "CASCADE" });
db.likes.belongsTo(db.posts, { foreignKey: "post_id" });

// User - Like association (User can like many posts)
db.users.hasMany(db.likes, { foreignKey: "user_id", onDelete: "CASCADE" });
db.likes.belongsTo(db.users, { foreignKey: "user_id" });

// User - Share association (User shares many posts)
db.users.hasMany(db.shares, { foreignKey: "user_id", onDelete: "CASCADE" });
db.shares.belongsTo(db.users, { foreignKey: "user_id" });

// Post - Share association (Post can be shared many times)
db.posts.hasMany(db.shares, { foreignKey: "post_id", onDelete: "CASCADE" });
db.shares.belongsTo(db.posts, { foreignKey: "post_id" });

// Post - Viewed association (Track users who viewed a post)
db.posts.hasMany(db.viewed, { foreignKey: "post_id", onDelete: "CASCADE" });
db.viewed.belongsTo(db.posts, { foreignKey: "post_id" });

// User - Viewed association (User can view many posts)
db.users.hasMany(db.viewed, { foreignKey: "user_id", onDelete: "CASCADE" });
db.viewed.belongsTo(db.users, { foreignKey: "user_id" });

module.exports = db;
