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
        button_text: {          
          type: Sequelize.STRING,
          allowNull: true,
        },
        button_link: {          
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        timestamps: true,
      }
    );
    return StaticPage;
  };
  