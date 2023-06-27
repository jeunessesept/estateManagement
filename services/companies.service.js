const { models } = require("../models")
const createError = require('http-errors')


//enter/create a company in the database 
const createCompany = async (companyInfo) => {
    const newCompany = await models.companies.create(companyInfo)
    
    return newCompany
}

/* 
assigner une société à un building. Cette fonction est utilisée dans la fonction de création d'un building (voir :  services/building.service.js)
*/
const setCompanyToBuilding = async (companyId, buildingId) => {
    const company = await models.companies.findByPk(companyId)
    const building = await models.buildings.findByPk(buildingId)
    if(!building){
        throw createError(404, "not found")
    }

    await building.setCompany(company)

    return 
}

//find information on all companies
const getCompanies = async () => {
    const companies = await models.companies.findAll()
    if(!companies){
        throw createError(404, "not found")
    }

    return companies

}

module.exports = {
    createCompany, 
    setCompanyToBuilding,
    getCompanies
}