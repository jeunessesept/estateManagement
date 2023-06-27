const { roomService } = require('../services')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync');



/// create room
const createRoom = catchAsync(async (req, res) => {
    const buildingId = req.params.buildingId
    const {roomInfos, typeCharges} = req.body

    const newRoom = await roomService.createRoom(buildingId, roomInfos, typeCharges)
    return res.status(httpStatus.CREATED).send(newRoom)
})


const getRooms = catchAsync(async (req, res) => {
    const rooms = await roomService.getRooms()
    return res.status(httpStatus.OK).send(rooms)

})

const getRoomById = catchAsync(async (req, res) => {
    const {roomId} = req.params

    const room = await roomService.getRoomById(roomId)
    return res.status(httpStatus.OK).send(room)
})


const getRoomsbyBuildingId = catchAsync(async (req, res) => {
    const buildingId = req.params.buildingId
    const rooms = await roomService.getRoomsbyBuildingId(buildingId)
    return res.status(httpStatus.OK).send(rooms)

})

const updateRoom = catchAsync(async (req, res) => {
    const roomId = req.params.roomId
    await roomService.updateRoom(roomId, roomInfos)
    return res.status(httpStatus.OK).json("updated")
})



module.exports = {
    createRoom,
    getRooms,
    getRoomById,
    getRoomsbyBuildingId,
    updateRoom
}

