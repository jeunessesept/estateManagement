const { version } = require('../package.json');
const dotenv = require('dotenv')

dotenv.config()


const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'eLIV-Y API',
    version,
    license: {
      name: 'MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}/v1`,
    },
  ],
};


module.exports = swaggerDef ;