module.exports = (sequelize, Sequelize) => {
    const InformationContact = sequelize.define(
        "information_contact",
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
            image: {
                type: Sequelize.STRING,
                allowNull: true // Optional field
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true // Optional field
            },
            value: {
                type: Sequelize.STRING,
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            }
        },
        {
            timestamps: false
        }
    );
    return InformationContact;
};
