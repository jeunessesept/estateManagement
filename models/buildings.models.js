const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    const building = sequelize.define(
        'buildings', {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            addressStreet: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            addressNumber: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            addressCity: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            addressPostalCode: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            addressCountry: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            electricity: {
                type: DataTypes.STRING,
                allowNull: true
            },
            water: {
                type: DataTypes.STRING,
                allowNull: true
            },
            gaz: {
                type: DataTypes.STRING,
                allowNull: true
            },
            doorCode: {
                type: DataTypes.STRING,
                allowNull: false
            },
            iban: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            bic: {
                type: DataTypes.STRING(50),
                allowNull: false
            },

        }
    )
    return building
}