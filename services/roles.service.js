const { models } = require('../models');
const createError = require('http-errors')
const { Op } = require('sequelize');


const doesRoleExists = async (roleId) => {
    const role = await models.roles.findByPk(roleId);

    if (role) return true;
    return false;
};


const getRoles = async () => {
    return await models.roles.findAll({
        attributes: ['id', 'name'],
    });
};

const setRoleOwner = async (ownersIds, buildingId) => {

    const ownerRole = await models.roles.findOne({
        where: { name: "owner" }
    })

    const users = await models.users.findAll({
        where: {
            id: {
                [Op.in]: ownersIds,
            },
        }
    })

    if (!users || users.length === 0) {
        throw createError(404, 'not found')
    }

    const owners = []
    for (let user of users) {
        const owner = user.addRole(ownerRole)
        await models.ownerBuilding.create({
            buildingId: buildingId,
            ownerId: user.id
        })

        owners.push(owner)
    }

    return owners
}

const setRoleManager = async (managersIds, buildingId) => {
    const managerRole = await models.roles.findOne({
        where: { name: "manager" }
    })

    const users = await models.users.findAll({
        where: {
            id: {
                [Op.in]: managersIds
            },
        }
    })

    if (!users || users.length === 0) {
        throw createError(404, 'not found')
    }

    const managers = []
    for (let user of users) {
        const manager = user.addRole(managerRole)
        await models.managerBuilding.create({
            buildingId: buildingId,
            managerId: user.id
        })

        managers.push(manager)
    }

    return managers
}







module.exports = {
    doesRoleExists,
    getRoles,
    setRoleOwner,
    setRoleManager
}