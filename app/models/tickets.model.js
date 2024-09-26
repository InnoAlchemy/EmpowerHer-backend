module.exports = (sequelize, Sequelize) => {
    const Ticket = sequelize.define(
      "ticket",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        event_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
         
        },
        is_used: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        tickets_availability: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1, // default to 0 tickets available
        },
      },
      {
        timestamps: true,
      }
    );
    return Ticket;
  };
  