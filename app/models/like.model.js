module.exports = (sequelize, Sequelize) => {
    const Like = sequelize.define("Like", {
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      post_id: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    return Like;
  };
  