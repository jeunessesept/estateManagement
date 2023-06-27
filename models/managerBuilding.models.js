const { Model, DataTypes  } = require("sequelize");

module.exports = (sequelize) => {
    const managerBuilding = sequelize.define(
        "managerBuilding", {
            buildingId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'buildings',
                    key: 'id'
                }

            },
            managerId: {
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
            tableName: 'managerBuilding'
        }
    )
}