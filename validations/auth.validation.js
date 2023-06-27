const Joi = require("joi")
const password = require('./custom.validation')

const register = {
    body: Joi.object().keys({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        phoneNumber: Joi.string().max(50),
        email: Joi.string().email().required(),  ///.email({ tlds: { allow: false } }) => false to allow any TLD not listed in the deny list (IANA list/registry), if present. 
        password: Joi.string().required().custom(password)
    })
}

const login = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
}

const updatePassword = {
    body: Joi.object().keys({
        password: Joi.string().required().custom(password)
    })
}

const resetPassword = {
    body: Joi.object().keys({
        password: Joi.string().required().custom(password),
        confirmPassword: Joi.string().required().custom(password)
    }),
    params: Joi.object().keys({
        id: Joi.number().required(),
        token: Joi.string().required(),
    })
}



module.exports = {
    register,
    login,
    updatePassword,
    resetPassword
}