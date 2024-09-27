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
       qrcode:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
       },
       amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      /*
       limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1, 
      },*/
     
      },
      {
        timestamps: true,
      }
    );
    return Ticket;
  };
  