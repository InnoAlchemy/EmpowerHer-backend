module.exports = (sequelize, Sequelize) => {
    const UserTool = sequelize.define(
      "user_tool",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        //id: {
        //  type: Sequelize.STRING,
        //  primaryKey: true,
        //  defaultValue: Sequelize.UUIDV4, // Auto-generate UUIDs
      //  },
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
  