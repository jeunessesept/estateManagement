const express = require('express')
const authRoute = require("./auth.route")
const usersRoute = require("./users.route")
const buildingsRoute = require("./buildings.route")
const roomsRoute = require('./rooms.route')
const tenantsRoute = require('./tenants.route')
const companiesRoute = require('./companies.route')
const leaseRoute = require('./leaseAgreement.route')
const docsRoute = require('./docs.route')
const archiveRoute = require('./archiveTenant.routes')
const router = express.Router()

const devRoutes  = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/user',
        route: usersRoute
    },
    {
        path: '/building',
        route: buildingsRoute
    },
    {
        path: '/room',
        route: roomsRoute
    },
    {
        path: '/tenant',
        route: tenantsRoute
    },
    {
        path: '/company',
        route: companiesRoute
    },
    {
        path: '/contract',
        route: leaseRoute
    },
    {
        path: '/docs',
        route: docsRoute,
    },
    {
        path: '/archive',
        route: archiveRoute
    }
]

devRoutes.forEach((route) => {
    router.use(route.path, route.route)
});

module.exports = router;