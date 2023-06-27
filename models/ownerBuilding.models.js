const { Model, DataTypes  } = require("sequelize");

module.exports = (sequelize) => {
    const ownerBuilding = sequelize.define(
        "ownerBuilding", {
            buildingId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'buildings',
                    key: 'id'
                }

            },
            ownerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            }
        },
        {
            sequelize, 
            tableName: 'ownerBuilding'
        }
    )
    return ownerBuilding
}