const { Model, DataTypes } = require('sequelize');
const moment = require("moment")



module.exports = (sequelize) => {
    const token = sequelize.define(
      'tokens',
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
            onDelete: 'CASCADE'
          }
        },
        tenantId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'tenants',
            key: 'id',
            onDelete: 'CASCADE'
          }
        },
        token: {
          type: DataTypes.STRING,
          allowNull: false
        },
        expires: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: moment().add(1, 'day')
        }
      },
      {
        tableName: 'tokens',
      }
    ); 
    token.prototype.isExpired = function () {
      return moment().isAfter(this.expires);
    };
    return token;
  };