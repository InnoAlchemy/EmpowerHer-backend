module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("Comment", {
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      post_id: { type: Sequelize.INTEGER, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    return Comment;
  };
  