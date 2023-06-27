const { tenantService } = require("../services")
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync');




const createTenant = catchAsync(async (req, res) => {
    const {roomId} = req.params;
    const {tenantInfos, specialCondition } = req.body
    const newTenant = await tenantService.createTenant(roomId, tenantInfos, specialCondition)
    return res.status(httpStatus.CREATED).send(newTenant)
})

const updateCreatedTenantInfos = catchAsync(async (req, res) => {
    const {tenantId, token} = req.params;
    const tenantInfos = req.body;

    await tenantService.updateCreatedTenantInfos(tenantId, tenantInfos, token)
    return res.status(httpStatus.OK).send({ info: "tenant succesfully registered"})

})

const registrationTenantFormRequest = catchAsync(async (req, res) => {
    const {tenantEmail} = req.body

    await tenantService.registrationTenantFormRequest(tenantEmail)
    return res.status(httpStatus.OK).send({info: 'mail sent successfully'})
})

const getAllTenants = catchAsync(async (req, res) => {
    const tenants = await tenantService.getAllTenants()
    return res.status(httpStatus.OK).send(tenants)
})

const getTenantById = catchAsync(async (req, res) => {
    const {tenantId} = req.params;
    const tenant = await tenantService.getTenantById(tenantId)
    return res.status(httpStatus.OK).send(tenant)
})

const getTenantsByBuilding = catchAsync(async (req, res) => {
    const {buildingId}= req.params;
    const tenants = await tenantService.getTenantsByBuilding(buildingId)
    return res.status(httpStatus.OK).send(tenants)
})

const removeTenant = catchAsync(async (req, res) => {
    const {tenantId} = req.params
    await tenantService.removeTenant(tenantId)
    return res.status(httpStatus.OK).send({info: 'tenant successfully removed'})
})


module.exports = {
    createTenant,
    getAllTenants,
    getTenantById,
    getTenantsByBuilding,
    updateCreatedTenantInfos,
    registrationTenantFormRequest,
    removeTenant
}