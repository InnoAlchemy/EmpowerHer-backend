module.exports = (sequelize, Sequelize) => {
    const PageSection = sequelize.define(
      "page_section",
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
        page_id: {
          type: Sequelize.INTEGER,
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
        image: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        position: {
          type: Sequelize.ENUM("left", "right", "center"),
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM("content_box", "list"),
          allowNull: false,
        },
      },
      {
        timestamps: true,
      }
    );
    return PageSection;
  };
  