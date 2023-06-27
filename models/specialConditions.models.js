const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    const specialCondition = sequelize.define(
       'specialConditions', {
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: true
        }
       }
    )
    return specialCondition
}