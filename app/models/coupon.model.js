module.exports = (sequelize, Sequelize) => {
    const Coupon = sequelize.define(
      "coupon",
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
        code: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        limit: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: -1, // -1 for unlimited usage
        },
        amount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        
      },
      {
        timestamps: true,
      }
    );
    return Coupon;
  };
  