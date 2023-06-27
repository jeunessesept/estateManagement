const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const tenantFiles = sequelize.define(
        'tenantFiles', {
            tenantId:{
                type: DataTypes.INTEGER,
                allowNull: true, 
                references:{
                    model: 'tenants',
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
    return tenantFiles
    
}