module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
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
      membership_role_id: {
        type: Sequelize.STRING,
        defaultValue: "basic",
      },
      membership_updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      //newly added
      role: {
        type: Sequelize.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user",
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // By default, the user is not verified
      },
      is_accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // By default, the user is not accepted
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
