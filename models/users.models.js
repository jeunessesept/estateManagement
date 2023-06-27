
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define(
        'users',
        {
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
                get() {
                    return `${this.firstname} ${this.lastname}`
                },
            },
            phoneNumber: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: 'mail',
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            isPasswordResetRequired: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        },
        {
            defaultScope: {
                attributes: {exclude: ['password']}
            },
            scopes:{
                withPassword: {
                    attributes: {}
                }
            },
            hooks: {
                afterCreate: (user) => {
                    delete user.dataValues.password;
                }
            }
        },
        {
            tableName: "users"
        }
    )
    sequelize
    return User
};











































// module.exports = (sequelize) => {
//     const user = sequelize.define(
//         'users',
//         {
//             firstname: {
//                 type: DataTypes.STRING(50),
//                 allowNull: false,
//             },
//             lastname: {
//                 type: DataTypes.STRING(50),
//                 allowNull: false
//             },
//             fullname: {
//                 type: DataTypes.VIRTUAL,
//                 get() {
//                     return `${this.firstname} ${this.lastname}`
//                 },
//             },
//             phoneNumber: {
//                 type: DataTypes.STRING(50),
//                 allowNull: true
//             },
//             email: {
//                 type: DataTypes.STRING(100),
//                 allowNull: false,
//                 unique: 'mail',
//                 validate: {
//                     isEmail: true,
//                 },
//             },
//             password: {
//                 type: DataTypes.STRING(255),
//                 allowNull: false
//             }
//         },
//         {
//             defaultScope: {
//                 attributes: {exclude: ['password']}
//             },
//             scopes:{
//                 withPassword: {
//                     attributes: {}
//                 }
//             },
//             hooks: {
//                 afterCreate: (user) => {
//                     delete user.dataValues.password;
//                 }
//             }
//         },
//         {
//             tableName: "users"
//         }
//     )
//     sequelize
//     return user
// };



