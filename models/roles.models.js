const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const role = sequelize.define(
        'roles', {
            name: {
                type: DataTypes.STRING(50),
                allowNull: false
            }
        }
    )
}

