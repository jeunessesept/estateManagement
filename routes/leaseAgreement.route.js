const express = require('express')
const auth = require('../middleware/authentification')
const leaseAgreementController = require('../controllers/leaseAgreement.controller')

const router = express.Router()

/// routes only usefull for test during developement

router.get('/lease/room/:roomId', auth, leaseAgreementController.getLeaseAgreementInfos)
router.get('/lease/email', auth, leaseAgreementController.pdfLeaseAgreementMail)


module.exports = router