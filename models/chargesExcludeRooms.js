const { Model, DataTypes  } = require("sequelize");

module.exports = (sequelize) => {
    const excludeCharges = sequelize.define(
        "chargesExcludeRooms", {
            roomId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'rooms',
                    key: 'id'
                }

            },
            chargesId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'charges',
                    key: 'id'
                }
            }
        },
        {
            sequelize, 
        }
    )
}