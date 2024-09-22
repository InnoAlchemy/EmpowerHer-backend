module.exports = (sequelize, Sequelize) => {
    const Page = sequelize.define(
      "page",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
       
        header_image: {
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
    return Page;
  };
  