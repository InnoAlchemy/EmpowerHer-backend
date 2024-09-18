module.exports = (sequelize, Sequelize) => {
    const Membership = sequelize.define(
      "membership",
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
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM("individual", "corporate", "basic"),
          allowNull: false,
          defaultValue:'basic'
        },
        price: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
      },
      {
        timestamps: true,
      }
    );
    return Membership;
  };
  