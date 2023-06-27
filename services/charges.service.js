const { sequelize } = require("../models/index")
const { models } = require("../models")
const createError = require('http-errors')


/* 
function for adding loads to a chamber.
charges are sent to two specific tables, depending on whether they are included or excluded from the charge amount.
this function is used in the room creation function (see: services/room.service.js)
*/
const addCharge = async (typeCharges, roomId) => {
    const charges = await models.charges.findAll() 

    if (!charges) {
        throw createError(404, 'not found')
    }

    let inclCharges;
    let exclCharges;

    for (let charge of charges)
        if (typeCharges.includes(charge.type)) {
            inclCharges = await models.chargesIncludeRooms.create({
                chargeId: charge.id,
                roomId: roomId
            })
        }
        else {
            exclCharges = await models.chargesExcludeRooms.create({
                chargeId: charge.id,
                roomId: roomId
            })
        }

    return {
        inclCharges,
        exclCharges
    }

}

module.exports = {
    addCharge
}
