module.exports = (sequelize, Sequelize) => {
    const DiscoverHerContent = sequelize.define(
      "discover_her_content",
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
        category: {
          type: Sequelize.ENUM("article", "video", "tools"),
          allowNull: false,
        },
        header_file: {
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
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        timestamps: true,
      }
    );
    return DiscoverHerContent;
  };
  