const express = require('express')
const userController = require('../controllers/user.controller')
const validate = require('../middleware/validate')
const userValidation = require("../validations/users.validation")
const auth = require('../middleware/authentification')

const router = express.Router()

router.get('/', validate(userValidation.getUsers), userController.getUsers)
router.get('/userbyid',auth, userController.getUserById)

module.exports = router