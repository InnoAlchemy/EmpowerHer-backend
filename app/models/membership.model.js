module.exports = (sequelize, Sequelize) => {
    const Membership = sequelize.define(
      "membership",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
       
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
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
      },
      {
        timestamps: true,
      }
    );
    return Membership;
  };
  