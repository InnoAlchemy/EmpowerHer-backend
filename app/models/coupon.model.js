module.exports = (sequelize, Sequelize) => {
    const Coupon = sequelize.define(
      "coupon",
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
        code: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        limit: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: -1, // -1 for unlimited usage
        },
      },
      {
        timestamps: true,
      }
    );
    return Coupon;
  };
  