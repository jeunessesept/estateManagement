
const Joi = require("joi")

/////

const roomInfosSchema = Joi.object().keys({
    roomNumber: Joi.string().required(),
    status: Joi.string().valid('rented', 'free', 'available from').required(),
    availableFrom: Joi.date().optional(),
    type: Joi.string().valid('room', 'flat', 'studio', 'office', 'commerce').required(),
    rent: Joi.number().required(),
    charges: Joi.number().optional(),
    rentReview: Joi.date().optional(),
    doorCode: Joi.string().required()
});


const createRoom = {
    params: Joi.object().keys({
        buildingId: Joi.number().required()
    }),
    body: Joi.object().keys({
        roomInfos: roomInfosSchema,
        typeCharges: Joi.array().items(Joi.string().valid('gaz', 'eau', 'electricite', 'internet', 'nettoyage des communs'))
    }),
    
};


/////
const getRooms = {
    query: Joi.object().keys({
        roomNumner: Joi.string(),
        status: Joi.string().valid('rented', 'free', 'available from'),
        availableFrom: Joi.date().iso(),
        type: Joi.string().valid('room', 'flat', 'studio', 'office', 'commerce'),
        rent: Joi.number(),
        charges: Joi.number(),
        rentReview: Joi.date(),
        specialConditions: Joi.string(),
        doorCode: Joi.string(),
        totalRent: Joi.string(),
        deposit: Joi.string()
    })
}


const getRoomById = {
    query: Joi.object().keys({
        roomNumner: Joi.string(),
        status: Joi.string().valid('rented', 'free', 'available from'),
        availableFrom: Joi.date().iso(),
        type: Joi.string().valid('room', 'flat', 'studio', 'office', 'commerce'),
        rent: Joi.number(),
        charges: Joi.number(),
        rentReview: Joi.date(),
        specialConditions: Joi.string(),
        doorCode: Joi.string(),
        totalRent: Joi.string(),
        deposit: Joi.string()
    })
}



const getRoomsbyBuildingId = {
    params: Joi.object().keys({
        buildingId: Joi.number().required()
    }),
    query: Joi.object().keys({
        roomNumner: Joi.string(),
        status: Joi.string().valid('rented', 'free', 'available from'),
        availableFrom: Joi.date().iso(),
        type: Joi.string().valid('room', 'flat', 'studio', 'office', 'commerce'),
        rent: Joi.number(),
        charges: Joi.number(),
        rentReview: Joi.date(),
        specialConditions: Joi.string(),
        doorCode: Joi.string(),
        totalRent: Joi.string(),
        deposit: Joi.string()
    })

}

const updateRoom = {
    params: Joi.object().keys({
        roomId: Joi.number().required()
    }),
    body: Joi.object().keys({
        roomNumner: Joi.string(),
        status: Joi.string().valid('rented', 'free', 'available from'),
        availableFrom: Joi.date().iso(),
        type: Joi.string().valid('room', 'flat', 'studio', 'office', 'commerce'),
        rent: Joi.number(),
        charges: Joi.number(),
        rentReview: Joi.date(),
        specialConditions: Joi.string(),
        doorCode: Joi.string(),
    })
}


module.exports = {
    createRoom,
    getRooms,
    getRoomById,
    getRoomsbyBuildingId,
    updateRoom
}