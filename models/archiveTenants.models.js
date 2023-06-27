const { Model, DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const archiveTenant = sequelize.define(
        "archiveTenants", {
            tenantName: {
                type: DataTypes.STRING(55),
                allowNull: true
            },
            tenantEmail: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: 'mail',
                validate: {
                    isEmail: true,
                },
            },
            roomId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "rooms",
                    key: "id"
                }
            }
        }
    )
    return archiveTenant
    
}