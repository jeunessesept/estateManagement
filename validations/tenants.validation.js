const Joi = require("joi").extend(require('@joi/date'))

const specialCondition = Joi.object().keys({
    title: Joi.string(),
    content: Joi.string()
})

const tenantInfos = Joi.object().keys({
    firstname: Joi.string(),
    lastname: Joi.string(),
    email: Joi.string(),
    deposit: Joi.number(),
    contractStart: Joi.date(),
    contractEnd: Joi.date()
})

const createTenant = {
    params: Joi.object().keys({
        roomId: Joi.number()
    }),
    body: Joi.object().keys({
        tenantInfos: tenantInfos,
        specialCondition: specialCondition
    })
}

const updateCreatedTenantInfos = {
    params: Joi.object().keys({
        tenantId: Joi.number(),
        token: Joi.string()
    }),
    body: Joi.object().keys({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        birthdate: Joi.date().required(),
        idNumber: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        addressStreet: Joi.string().required(),
        addressNumber: Joi.string().required(),
        addressCity: Joi.string().required(),
        addressPostalCode: Joi.string().required(),
        addressCountry: Joi.string().required(),

    })


}

const getAllTenants = {
    query: Joi.object().keys({
        firstname: Joi.string(),
        lastname: Joi.string(),
        email: Joi.string(),
        birthdate: Joi.date().format('DD/MM/YYYY'),
        deposit: Joi.number(),
        idNumber: Joi.string(),
        phoneNumber: Joi.string(),
        addressStreet: Joi.string(),
        addressNumber: Joi.string(),
        addressCity: Joi.string(),
        addressPostalCode: Joi.string(),
        addressCountry: Joi.string(),
        arrival: Joi.date().format('DD/MM/YYYY'),
        contractStart: Joi.date().format('DD/MM/YYYY'),
        contractEnd: Joi.date().format('DD/MM/YYYY')
    })
}

const getTenantById = {
    params: Joi.object().keys({
        tenantId: Joi.number()
    }),
    query: Joi.object().keys({
        firstname: Joi.string(),
        lastname: Joi.string(),
        deposit: Joi.number(),
        email: Joi.string(),
        birthdate: Joi.date().format('DD/MM/YYYY'),
        idNumber: Joi.string(),
        phoneNumber: Joi.string(),
        addressStreet: Joi.string(),
        addressNumber: Joi.string(),
        addressCity: Joi.string(),
        addressPostalCode: Joi.string(),
        addressCountry: Joi.string(),
        arrival: Joi.date().format('DD/MM/YYYY'),
        contractStart: Joi.date().format('DD/MM/YYYY'),
        contractEnd: Joi.date().format('DD/MM/YYYY')
    })
}

const getTenantsByBuilding = {
    params: Joi.object().keys({
        buildingId: Joi.number()
    }),
    query: Joi.object().keys({
        fullname: Joi.string()
    })

}


module.exports = {
    createTenant,
    getAllTenants,
    getTenantById,
    getTenantsByBuilding,
    updateCreatedTenantInfos
}