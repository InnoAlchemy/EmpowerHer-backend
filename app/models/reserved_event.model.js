module.exports = (sequelize, Sequelize) => {
    const ReservedEvent = sequelize.define(
      "reserved_event",
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
        event_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: false, 
          defaultValue: 1, 
        },
        coupon_used_id: {
          type: Sequelize.INTEGER,
          allowNull: true,  // Nullable since coupon may not be used
        },
       
        payment_data: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        ticket_quantity: {
          type: Sequelize.INTEGER, // Number of tickets reserved
          allowNull: false,
        },
        total_price: {//  = price(event model) * ticket_quantity
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        is_paid: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        timestamps: true,
      }
    );
    return ReservedEvent;
  };
  