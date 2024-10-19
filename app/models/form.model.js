module.exports = (sequelize, Sequelize) => {
    const Form = sequelize.define(
        "form",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
              },
           
            first_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phone_number: {
                type: Sequelize.STRING,
                allowNull: true
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            category: {
                type: Sequelize.ENUM("contact_us", "nomination_type", "partnership_type"),
                allowNull: false,
                defaultValue:'contact_us'
            },
            organization: {
                type: Sequelize.STRING,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM("new", "inprogress", "responded","closed"),
                allowNull: false,
                defaultValue:'new'
              },
            
              
        },
        {
            timestamps: false
        }
    );
    return Form;
};
