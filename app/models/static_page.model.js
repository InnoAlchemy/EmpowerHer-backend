module.exports = (sequelize, Sequelize) => {
    const StaticPage = sequelize.define(
      "static_page",
      {
        key: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
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
      },
      {
        timestamps: true,
      }
    );
    return StaticPage;
  };
  