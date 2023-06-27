const Joi = require("joi")


const createCompany = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        siren: Joi.string().required(),
        tva: Joi.string().required(),
        addressStreet: Joi.string().required(),
        addressNumber: Joi.string().required(),
        addressPostCode: Joi.string().required(),
        addressCity: Joi.string().required(),
        addressCountry: Joi.string().required(),
        email: Joi.string().required()
    })

}


module.exports = {
    createCompany
}