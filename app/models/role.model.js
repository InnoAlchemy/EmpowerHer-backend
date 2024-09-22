module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    "role",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      permissions: {
        type: Sequelize.JSON, // Store permissions in JSON format
        allowNull: false,
        defaultValue: [],
      },
    },
    {
      timestamps: true,
    }
  );
  return Role;
};
