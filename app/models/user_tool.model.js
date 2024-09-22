module.exports = (sequelize, Sequelize) => {
    const UserTool = sequelize.define(
      "user_tool",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
       
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        discover_her_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        timestamps: true,
      }
    );
    return UserTool;
  };
  