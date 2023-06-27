const { sequelize } = require("../models/index")
const { models } = require("../models")
const createError = require('http-errors')
const chargesService = require('./charges.service')

// Function to create a new room and associate it with a building
const createRoom = async (buildingId, roomInfos, typeCharges) => {
    // Find the building by its ID
    const building = await models.buildings.findByPk(buildingId)
    if (!building) {
        throw createError(404, 'Building not found');
    }
    // Create a new room with the provided information
    const newRoom = await models.rooms.create({
        ...roomInfos
    })

    // Associate the new room with the building
    await building.addRooms(newRoom)

    // If typeCharges is provided, add the charge to the room
    if (typeCharges !== undefined) {
        await chargesService.addCharge(typeCharges, newRoom.id);
    } 

    // Return the newly created room and typeCharges
    return  { newRoom, typeCharges }

}

// Function to retrieve all rooms with associated information
const getRooms = async () => {
    // Find all rooms and include associated models such as charges and tenants
    const rooms = await models.rooms.findAll({
        include: [
            {
                model: models.charges,
                as: 'typeOfIncCharges'
            },
            {
                model: models.charges,
                as: 'typeOfExcCharges'
            },
            {
                model: models.tenants,
                attributes: ['firstname', 'lastname','contractStart', 'contractEnd']
            }

        ]
    })

    // Return the rooms datas
    return rooms
}

// Function to retrieve a room by its ID with associated information       // for the moment this route is not used in the front part
const getRoomById = async (roomId) => {
    // Find a room by its ID and include associated models such as tenants and charges
    const room = await models.rooms.findByPk(roomId,
        {
            include: [
                {
                    model: models.tenants,
                    attributes: ['firstname', 'lastname', 'contractStart', 'contractEnd']
                },
                {
                    model: models.charges,
                    as: 'typeOfIncCharges'
                },
                {
                    model: models.charges,
                    as: 'typeOfExcCharges'
                }
                
            ]

        }
    )
    
    // Return the room datas
    return room
}


// Function to retrieve all rooms associated with a building ID
const getRoomsbyBuildingId = async (buildingId) => {
    const building = await models.buildings.findByPk(buildingId);

    if (!building) {
        throw createError(404, 'Building not found');
    }
    const buildingName = building.name

    // Get all rooms associated with the building and include associated models
    const rooms = await building.getRooms({
        include: [
            {
                model: models.tenants,
                attributes: ['firstname', 'lastname', 'contractStart', 'contractEnd']

            },
            {
                model: models.charges,
                as: 'typeOfIncCharges'
            },
            {
                model: models.charges,
                as: 'typeOfExcCharges'
            }
        ]


    });

    // If no rooms are found, throw an error
    if (!rooms || rooms.length === 0) {
        throw createError(404, 'rooms not found');
    }

    return {
        buildingName,
        rooms
    };
}

// Function to update a room with new information
const updateRoom = async (roomId, roomInfos) => {
    const updateRoom = await models.rooms.update(
        {
            ...roomInfos  // Spread the roomInfos object to update the corresponding fields
        },
        {
            where: { id: roomId }
        }
    )
    return {    // Return an object containing the result of the update operation
        updateRoom     
    }

}



module.exports = {
    createRoom,
    getRooms,
    getRoomById,
    getRoomsbyBuildingId,
    updateRoom
}