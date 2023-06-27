const { models } = require("../models")
const createError = require('http-errors')
const rolesService  = require('./roles.service')
const companiesService = require('./companies.service')


/*building creation function. To see an overview of what "buildingInfos" or even "buildings.validation.js" contains. 
When a building is created, the users concerned are assigned the roles of owners, managers. (this is the only role-assignment stage, but it may be necessary to consider it in a different way).
if the building belongs to a company, this is when the building is assigned to a company */
const createBuilding = async (buildingInfos , ownersIds, managersIds, companyId) => {

    const newBuilding = await models.buildings.create({
        ...buildingInfos
    })
    
    await rolesService.setRoleOwner(ownersIds, newBuilding.id)
    await rolesService.setRoleManager(managersIds, newBuilding.id)
    await companiesService.setCompanyToBuilding(companyId, newBuilding.id)
    
    return newBuilding;
}



/*
retrieve data from all buildings. 
Includes rooms owned by the building, as well as tenants (if any). As well as owners/company, managers and signatories.
*/
const getBuildings = async () => {
    const buildings = await models.buildings.findAll({
        include: [
            {
                model: models.rooms,
                include: [
                    {
                        model: models.tenants,
                        attributes: ['firstname', 'lastname']
                    },
                ]
            },
            {
                model: models.companies,
            },
            {
                model: models.users,
                as: "managers"
            },
            {
                model: models.users,
                as: "owners"
            }
        ]
    })
    return buildings
}


/*
retrieve data for a specific building (by id). 
Includes rooms owned by the building, as well as tenants (if any),and room charges (included and excluded). As well as owners/company, managers and signatories.
 */
const getBuildingById = async (buildingId) => {
    const building = await models.buildings.findByPk(buildingId, {
        include: [
            {
                model: models.rooms,
                include: [
                    {
                        model: models.charges,
                        as: 'typeOfIncCharges',
                        attributes: ['type']
                    },
                    {
                        model: models.charges,
                        as: 'typeOfExcCharges',
                        attributes: ['type']
                    }
                ]
            },
            {
                model: models.companies,
            },
            {
                model: models.users,
                as: "managers"
            },
            {
                model: models.users,
                as: "owners"
            }
        ]
    })

    if (!building) {
        throw createError(404, 'Building not found');
    }
    return building
}


/* 
update building information, if required
*/
const updateInfoBuilding = async (buildingId, buildingInfos) => {
    const building = await models.buildings.findByPk(buildingId)
    const updateBuilding = await building.update(buildingInfos)
    return {
        building,
        updateBuilding
    }   
}


//function to remove a building
const removeBuilding = async (buildingId) => {
    const building = await models.buildings.findByPk(buildingId)
    if(!building){
        throw createError(400, 'Bad Request')
    }
    await building.destroy()
}

module.exports = {
    createBuilding,
    getBuildings,
    getBuildingById,
    updateInfoBuilding,
    removeBuilding
}