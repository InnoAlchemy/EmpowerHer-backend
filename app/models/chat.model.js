// models/Chat.js
module.exports = (sequelize, Sequelize) => {
  const Chat = sequelize.define(
    "Chat",
    {
      type: {
        type: Sequelize.ENUM("message", "connection"),
        allowNull: false,
      },
      content: { type: Sequelize.TEXT, allowNull: true },
      sender_id: { type: Sequelize.INTEGER, allowNull: false },
      receiver_id: { type: Sequelize.INTEGER, allowNull: false },
      date_time: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      is_connected: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      status: {
        type: Sequelize.ENUM("request", "accepted", "rejected"),
        allowNull: true, // Only relevant for connection requests
      },
    },
    { timestamps: true }
  );
  return Chat;
};
