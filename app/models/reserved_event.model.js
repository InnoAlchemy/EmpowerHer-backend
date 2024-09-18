module.exports = (sequelize, Sequelize) => {
    const ReservedEvent = sequelize.define(
      "reserved_event",
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
        event_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        coupon_used_id: {
          type: Sequelize.INTEGER,
          allowNull: true,  // Nullable since coupon may not be used
        },
        payment_data: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        total_price: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
      },
      {
        timestamps: true,
      }
    );
    return ReservedEvent;
  };
  