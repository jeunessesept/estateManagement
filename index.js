const app = require("./app")
const dotenv = require("dotenv")
const sequelize = require("./models/index")
const logger = require('./config/logger')
const { transporter } = require('./config/sendmail.config')
const scheduleArchiveTenant = require('./utils/scheduleArchiveTenant')

dotenv.config()



scheduleArchiveTenant()  // function that enable "cron-node" to run 

let server;
try {
    server = app.listen(process.env.PORT, () => {
        logger.info(`Server listening on port: ${process.env.PORT}`)
    })
} catch (error) {
    console.error(error)
};

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});


const launchDB = async () => {
    await sequelize
        .authenticate()
        .then(() => {
            logger.info("Sequelize and database connection ok")
        })
        .catch((error) => {
            logger.error("unable to connect to the database", error)
        })
}

launchDB()


transporter
    .verify()
    .then(() => logger.info('connected to email server'))
    .catch((e) => logger.error(e))