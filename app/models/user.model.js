module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      role_id: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
        defaultValue: 1,
      },
      membership_role_id: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: true,
        defaultValue: 1,
      },
      membership_updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      newsletter_subscribed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status:{
      type: Sequelize.ENUM('active', 'inactive', 'idle'),
      defaultValue: 'inactive' 
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, 
      },
      otp: {
        type: Sequelize.INTEGER,
        allowNull: true, // Store OTP temporarily
      },
    },
    {
      timestamps: true,
    }
  );
  return User;
};
