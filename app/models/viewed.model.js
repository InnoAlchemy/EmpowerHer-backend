module.exports = (sequelize, Sequelize) => {
    const Viewed = sequelize.define("Viewed", {
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      post_id: { type: Sequelize.INTEGER, allowNull: false },
      viewedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    return Viewed;
  };
  