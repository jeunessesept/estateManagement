const { archiveTenantService } = require("../services")
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync');

const archiveExpiredTenantsBeforeEndContract = catchAsync(async (req, res) => {
    const { tenantId } = req.params
    await archiveTenantService.archiveExpiredTenantsBeforeEndContract(tenantId)
    res.status(httpStatus.OK).send({info: "tenant archived succesfully"})
})


const getArchivedInfos = catchAsync(async (req, res) => {
    const archivedInfos = await archiveTenantService.getArchivedInfos()
    res.status(httpStatus.OK).send(archivedInfos)
})

module.exports = { archiveExpiredTenantsBeforeEndContract, getArchivedInfos }