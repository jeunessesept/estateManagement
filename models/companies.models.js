const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    const company = sequelize.define(
        'companies', {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'mail',
            validate: {
                isEmail: true,
            }
        },
        siren: {
            type: DataTypes.STRING(50),
        },
        tva: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        addressStreet: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        addressNumber: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        addressPostCode: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        addressCity: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        addressCountry: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    },
        {
            timestamps: true
        }
    )
    return company
}