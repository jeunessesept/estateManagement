const authValidation = require('./auth.validation')
const usersValidation = require('./users.validation')
const buildingsValidation = require('./buildings.validation')
const roomsValidation = require('./rooms.validation')
const tenantsValidation = require('./tenants.validation')
const companiesValidation = require('./companies.validation')


module.exports = {
    authValidation,
    usersValidation,
    buildingsValidation,
    roomsValidation,
    tenantsValidation,
    companiesValidation
}