const Joi = require("joi")


const buildingInfosSchema = Joi.object().keys({
    name: Joi.string().required(),
    addressStreet: Joi.string().required(),
    addressNumber: Joi.string().required(),
    addressCity: Joi.string().required(),
    addressPostalCode: Joi.string().required(),
    addressCountry: Joi.string().required(),
    electricity: Joi.string().optional(),
    water: Joi.string().optional(),
    gaz: Joi.string().optional(),
    doorCode: Joi.string().required(),
    iban: Joi.string().required(),
    bic: Joi.string().required(),
})

const createNewBuilding = {
    body: Joi.object().keys({
        buildingInfos: buildingInfosSchema,
        ownersIds: Joi.array().items(Joi.number()),
        managersIds: Joi.array().items(Joi.number()),
        companyId: Joi.number()
    })
}

const getBuildings = {
    query: Joi.object().keys({
        name: Joi.string(),
        addressStreet: Joi.string(),
        addressNumber: Joi.string(),
        addressCity: Joi.string(),
        addressPostalCode: Joi.string(),
        addressCountry: Joi.string(),
        electricity: Joi.string().optional(),
        water: Joi.string().optional(),
        gaz: Joi.string().optional(),
        doorCode: Joi.string(),
        iban: Joi.string(),
        bic: Joi.string()
    })
}

const getBuildingById = {
    params: Joi.object().keys({
        buildingId: Joi.number(),
    }),
    query: Joi.object().keys({
        name: Joi.string(),
        addressStreet: Joi.string(),
        addressNumber: Joi.string(),
        addressCity: Joi.string(),
        addressPostalCode: Joi.string(),
        addressCountry: Joi.string(),
        electricity: Joi.string(),
        water: Joi.string(),
        gaz: Joi.string(),
        doorCode: Joi.string(),
        iban: Joi.string(),
        bic: Joi.string()
    })
}

const updateInfoBuilding = {
    params: Joi.object().keys({
        buildingId: Joi.number(),
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        addressStreet: Joi.string(),
        addressNumber: Joi.string(),
        addressCity: Joi.string(),
        addressPostalCode: Joi.string(),
        addressCountry: Joi.string(),
        electricity: Joi.string(),
        water: Joi.string(),
        gaz: Joi.string(),
        doorCode: Joi.string(),
        iban: Joi.string(),
        bic: Joi.string()
    })
}



module.exports = {
    createNewBuilding,
    getBuildings,
    getBuildingById,
    updateInfoBuilding
}