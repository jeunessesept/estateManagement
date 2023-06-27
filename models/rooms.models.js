const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    const room = sequelize.define(
        'rooms', {
        roomNumber: {
            type: DataTypes.STRING(55),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('rented', 'free', 'available from'),
            allowNull: true
        },
        availableFrom: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM('room', 'flat', 'studio', 'office', 'commerce'),
            allowNull: false,
        },
        rent: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        charges: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        totalRent: {
            type: DataTypes.VIRTUAL,
            get() {
                const rent = this.getDataValue('rent');
                const charges = this.getDataValue('charges');
                return rent + charges;
            },
        },
        rentReview: {
            type: DataTypes.DATE,
            allowNull: true
        },
        doorCode: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }
    )
    return room
}