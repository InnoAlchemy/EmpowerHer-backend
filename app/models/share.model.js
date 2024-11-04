// models/share.model.js

module.exports = (sequelize, Sequelize) => {
  const Share = sequelize.define("Share", {
    user_id: { // The user who shares the post
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    post_id: { // The post being shared
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    sharedAt: { // Timestamp of when the post was shared
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  return Share;
};
