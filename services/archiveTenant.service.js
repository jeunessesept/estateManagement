const { Op } = require("sequelize");
const { models } = require("../models")
const createError = require("http-errors")


const archiveExpiredTenantsByDate = async () => {             /// function that will check the contractEnd date, if the date is due, the tenant is deleted from the "tenants" table and send to "archive".
    const currentDate = new Date();

    const expiredTenants = await models.tenants.findAll({
        where: {
            contractEnd: {
                [Op.lte]: currentDate
            }
        },
        include: [
            {
                model: models.rooms,
                attributes: ["id"]
            }
        ]
    })

    for (const tenant of expiredTenants) {
        await models.archiveTenants.create({
            roomId: tenant.rooms[0].id,
            tenantName: tenant.fullname,
            tenantEmail: tenant.email
        }),

            await tenant.destroy()
    }
}


const archiveExpiredTenantsBeforeEndContract = async (tenantId) => {  ///if a tenant leaves the room before the end of the contract, he can be deleted from the "tenant" table and send to "archive" manually
    const tenant = await models.tenants.findByPk(tenantId, {

        include: [
            {
                model: models.rooms,
                attributes: ["id"]
            }
        ]
    })

    if(!tenant) {
        throw createError(404, "tenant not found")
    }

    const archivedTenant = await models.archiveTenants.create({
        roomId: tenant.rooms[0].id,
        tenantName: tenant.fullname,
        tenantEmail: tenant.email
    })

    await tenant.destroy()

    return archivedTenant

}

const getArchivedInfos = async () => {                         /// retrieves all the archives infos (tenantName, tenantEmail, roomId)
    const archivedInfos = await models.archiveTenants.findAll()
    if(!archivedInfos){
        createError(404, 'archives not found')
    }
    return archivedInfos
 }

module.exports = {
    archiveExpiredTenantsByDate, 
    archiveExpiredTenantsBeforeEndContract,
    getArchivedInfos
}