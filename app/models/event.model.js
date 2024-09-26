module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define(
      "event",
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
        image: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        time: {
          type: Sequelize.TIME,
          allowNull: false,
        },
        location: {
          type: Sequelize.STRING,
        },
        type: {
          type: Sequelize.ENUM("online", "on-site", "both"),
          allowNull: false,
        },
        category: {
          type: Sequelize.ENUM("event", "workshop"),
          allowNull: false,
        },
        price: {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        is_accepted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false, // By default, the Event is not accepted
        },
      },
      {
        timestamps: true,
      }
    );
    return Event;
  };
  