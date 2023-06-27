const { companiesService } = require('../services')
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status')

const createCompany = catchAsync(async (req, res) => {
    const companyInfo = req.body
    const company = await companiesService.createCompany(companyInfo)
    res.status(httpStatus.CREATED).send(company)
});

const setCompanyToBuilding = catchAsync(async (req, res) => {
    const companyId = req.params.companyId;
    const buildingId = req.params.buildingId;
    await companiesService.setCompanyToBuilding(companyId, buildingId)
    return res.status(httpStatus.Ok)
});

const getCompanies = catchAsync(async (req, res) => {
    const companies = await companiesService.getCompanies()
    return res.status(httpStatus.OK).send(companies)
})

module.exports = {
    createCompany,
    setCompanyToBuilding,
    getCompanies
}