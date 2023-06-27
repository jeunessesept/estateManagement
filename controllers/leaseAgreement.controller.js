const leaseService = require('../services/leaseAgreement.service')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync');

const getLeaseAgreementInfos = catchAsync(async (req, res) => {
    const { roomId } = req.params

    const leaseInfos = await leaseService.leaseAgreement(roomId)
    return res.status(httpStatus.OK).send(leaseInfos)
})

const pdfLeaseAgreementMail = catchAsync(async (req, res) => {
    const {tenantEmail} = req.body

    await leaseService.pdfLeaseAgreementMail(tenantEmail)
    return res.status(httpStatus.OK).json("lease agreement succesfuly send")
})

module.exports = { 
    getLeaseAgreementInfos,
    pdfLeaseAgreementMail
 }