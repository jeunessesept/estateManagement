const express = require('express')
const archivedTenantController = require('../controllers/archiveTenant.controller')
const validate = require('../middleware/validate')
const auth = require('../middleware/authentification')

const router = express.Router()

router.post('/tenant/:tenantId',auth, archivedTenantController.archiveExpiredTenantsBeforeEndContract)
router.get('/', auth, archivedTenantController.getArchivedInfos)

module.exports = router