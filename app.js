const express = require("express")
const routes = require('./routes')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cookie = require("cookie-parser")
const cors = require('cors')
const dotenv = require('dotenv')
const ErrorHandler = require('./middleware/errorhandler')
const morgan = require('morgan')




dotenv.config()
const app = express();


// parse json request body
app.use(express.json())
app.use(bodyParser.json())

app.use(morgan('dev'))

// parse urlencoded request
app.use(bodyParser.urlencoded({ extended: true}));
//enable cors 
app.use(
  cors({
    origin: ['http://localhost:4200', 'http://192.168.1.254:4200', 'http://127.0.0.1:4200'], // Include the trailing slash
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

///cookie parser 
app.use(cookie(process.env.SECRET_JWT))

//http security 
app.use(helmet())

app.unsubscribe(cookie(process.env.SECRET_JWT))

app.use('/v1', routes)


/// error handler middleware, must be the last to use 
app.use(ErrorHandler)

module.exports = app;