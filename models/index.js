const { Sequelize } = require('sequelize');
const dotenv = require("dotenv")
const path = require("path")
const fs = require("fs")
const { initModels } = require('./init-models');

const basename = path.basename(__filename)

dotenv.config()

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_ACCOUNT, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
        supportBigNumbers: true
    },
    timezone: '+02:00',
    define: {
        timestamps: true
    },
    logging: console.log,
    retry: {
        match: [Sequelize.ConnectionError, Sequelize.ConnectionTimedOutError, Sequelize.TimeoutError],
        max: 3,
    },
    
})

fs.readdirSync(__dirname)
    .filter((file) => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-10) === '.models.js';
    })
    .forEach((file) => {
        require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes); //eslint-disable-line
    });

initModels(sequelize);
module.exports = sequelize