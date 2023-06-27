const Joi = require("joi")

const getUsers = {
    query: Joi.object().keys({
        firstname: Joi.string(),
        lastname: Joi.string(),
        phoneNumber: Joi.string(),
        email: Joi.string(),
        isPasswordResetRequired: Joi.boolean()
    })
}





module.exports = { getUsers }