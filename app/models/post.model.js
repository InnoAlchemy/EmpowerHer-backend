module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("Post", {
      user_id: { type: Sequelize.INTEGER, allowNull: false,foreignKey:true },
      title: { type: Sequelize.TEXT, allowNull: true }, // Optional text title
      content: { type: Sequelize.TEXT, allowNull: true }, // Optional text content
      media_url: { type: Sequelize.STRING, allowNull: true }, // URL for image or video
      status: {  type: Sequelize.ENUM("investors", "partners", "clients" ,"others"), defaultValue: "others" }, // who are we looking for
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    return Post;
  };
  