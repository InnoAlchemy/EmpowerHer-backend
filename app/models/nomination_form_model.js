module.exports = (sequelize, Sequelize) => {
    const NominationForm = sequelize.define(
      "nomination_form",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
       
        nomination_type_id: {
            type: Sequelize.INTEGER,
            foreignKey: true, 
            allowNull: false
          },
          nominator_full_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nominee_full_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nominator_email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nominee_email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        reason_for_nomination: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        category: {
            type: Sequelize.ENUM("contact_us", "nomination_type", "partnership_type"),
            allowNull: false,
            defaultValue:'nomination_type'
        },
      },
      {
        timestamps: true,
      }
    );
    return NominationForm;
  };
  