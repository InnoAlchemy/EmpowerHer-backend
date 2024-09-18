module.exports = (sequelize, Sequelize) => {
    const TeamMember = sequelize.define(
      "team_member",
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
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        position: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        image: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        timestamps: true,
      }
    );
    return TeamMember;
  };
  