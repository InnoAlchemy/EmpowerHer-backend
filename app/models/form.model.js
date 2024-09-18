module.exports = (sequelize, Sequelize) => {
    const Form = sequelize.define(
        "form",
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
                allowNull: false
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            category: {
                type: Sequelize.STRING,
                allowNull: false
            }
        },
        {
            timestamps: false
        }
    );
    return Form;
};
