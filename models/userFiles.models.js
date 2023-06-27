const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const userFiles = sequelize.define(
        'userFiles', {
            userId:{
                type: DataTypes.INTEGER,
                allowNull: true, 
                references:{
                    model: 'users',
                    key: 'id'
                }
            },
            path: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            type:{
                type: DataTypes.STRING,
                allowNull: true
            }
        }
    )
    return userFiles
    
}