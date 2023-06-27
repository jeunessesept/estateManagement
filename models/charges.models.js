const { Model, DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const charges = sequelize.define(
        "charges", {
            type: {
                type: DataTypes.STRING(55),
                allowNull: true
            }
        }
    )
    return charges
    
}