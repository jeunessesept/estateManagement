const { Model, DataTypes } = require('sequelize')


module.exports = (sequelize) => {
    const tenant = sequelize.define(
        'tenants', {
            firstname: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            lastname: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            fullname: {
                type: DataTypes.VIRTUAL,
                get(){
                    return `${this.firstname} ${this.lastname}`
                }
            },
            email: {
                type: DataTypes.STRING(55),
                allowNull: false,
                unique: 'mail',
                validate: {
                    isEmail: true,
                },
            },
            deposit:{
                type: DataTypes.FLOAT,
                allowNull: true
            },
            birthdate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            idNumber: {
                type: DataTypes.STRING(155),
                allowNull: true
            },
            phoneNumber: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            addressStreet: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            addressNumber: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            addressCity: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            addressPostalCode: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            addressCountry: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            arrival: {
                type: DataTypes.DATE,
                allowNull: true
            },
            contractStart: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            contractEnd: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            isContractSend: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }
    )
    return tenant 
    
}