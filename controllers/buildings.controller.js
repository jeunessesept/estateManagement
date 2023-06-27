const { buildingService } = require('../services')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync');


/// create building controller 
const createBuilding = catchAsync(async (req, res) => {
    const { buildingInfos, ownersIds, managersIds, companyId } = req.body;
    const building = await buildingService.createBuilding(buildingInfos, ownersIds, managersIds, companyId)
    return res.status(httpStatus.CREATED).send(building)

});

/// get buildings controller 
const getBuildings = catchAsync(async (req, res) => {

    const buildings = await buildingService.getBuildings()
    return res.status(httpStatus.OK).send(buildings)
})

/// get building by id 

const getBuildingById = catchAsync(async (req, res) => {
    const id = req.params.buildingId

    const building = await buildingService.getBuildingById(id)
    return res.status(httpStatus.OK).send(building)
})

const updateInfoBuilding = catchAsync(async (req, res) => {

    const buildingId = req.params.buildingId
    const buildingInfos = req.body

    await buildingService.updateInfoBuilding(buildingId, buildingInfos)
    return res.status(httpStatus.OK).json("updated")
})

const removeBuilding = catchAsync(async (req, res) => {
    const buildingId = req.params.buildingId
    const deletedBuilding = await buildingService.removeBuilding(buildingId)
    return res.status(httpStatus.OK).send()
})



module.exports = {
    createBuilding,
    getBuildings,
    getBuildingById,
    updateInfoBuilding,
    removeBuilding
}