module.exports = (sequelize, Sequelize) => {
    const PartnershipForm = sequelize.define(
      "partnership_form",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
       
        partnership_type_id: {
            type: Sequelize.INTEGER,
            foreignKey: true, 
            allowNull: false
          },
          organization_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        contact_person_full_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        contact_person_email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone_number: {
            type: Sequelize.STRING,
            allowNull: true
        },
        description_of_proposal: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        category: {
            type: Sequelize.ENUM("contact_us", "nomination_type", "partnership_type"),
            allowNull: false,
            defaultValue:'partnership_type'
        },
      },
      {
        timestamps: true,
      }
    );
    return PartnershipForm;
  };
  