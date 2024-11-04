module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("Notification", {
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      post_id: { type: Sequelize.INTEGER, allowNull: true }, 
      type: { type: Sequelize.ENUM("general","requests","posts","comments","likes","views","shares"), allowNull: false ,default:'general'}, // e.g., "General", "Requests", "Posts"
      message: { type: Sequelize.STRING, allowNull: false },
      is_read: { type: Sequelize.BOOLEAN, defaultValue: false },
      date_time: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    return Notification;
  };
  