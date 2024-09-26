// role_permission.model.js
module.exports = (sequelize, Sequelize) => {
    const RolePermission = sequelize.define(
      "role_permission",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        role_id: {
          type: Sequelize.INTEGER,
          foreignKey: true, 
          allowNull: false
        },
        permission_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true 
        },
      },
      {
        timestamps: true,
      }
    );
    return RolePermission;
};
