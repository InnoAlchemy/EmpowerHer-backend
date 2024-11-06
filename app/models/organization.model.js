module.exports = (sequelize, Sequelize) => {
    const Organization = sequelize.define(
      "organization",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        user_id: {
          type: Sequelize.INTEGER,
          foreignKey: true,
          allowNull: false,
          
        },
       
        organization_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        organization_type:{
            type: Sequelize.ENUM('Company (SME)', 'Startup', 'Non-Profit'),
            defaultValue: 'Startup' ,
            allowNull: true,
          },
    
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        website: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
        phone_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
          },
        logo:{
          type: Sequelize.STRING,
          allowNull: true, 
        },
        products_services:{
            type: Sequelize.STRING,
            allowNull: true, 
          },
        country:{
          type: Sequelize.ENUM('lebanon', 'usa', 'united kingdom','japan','australia',),
          defaultValue: 'lebanon' ,
          allowNull: true,
        },
        city:{
            type: Sequelize.ENUM('beirut', ' washington', 'london','tokyo','sydney',),
            defaultValue: 'beirut' ,
            allowNull: true,
          },
          sector:{
            type: Sequelize.ENUM('Real Estate', 'Tech', 'Finance'),
            defaultValue: 'Tech' ,
            allowNull: true,
          },
          linkedin: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          instagram: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          facebook: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
      },
      {
        timestamps: true,
      }
    );
    return Organization;
  };
  