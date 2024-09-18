module.exports = (sequelize, Sequelize) => {
    const NominationType = sequelize.define(
      "nomination_type",
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
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        timestamps: true,
      }
    );
    return NominationType;
  };
  