const { models } = require("../models")
const createError = require('http-errors')
const emailService = require('./email.service');
const pdfGenerator = require('../utils/pdf')


const leaseAgreement = async (roomId) => {
    /* gather all the information needed to draw up the rental contract
    query, which draws information from the various tables  */

    const infos = await models.rooms.findByPk(roomId, {
        include: [
            {
                model: models.buildings,
                include: [
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
            },
            {
                model: models.charges,
                as: 'typeOfIncCharges'
            },
            {
                model: models.charges,
                as: 'typeOfExcCharges'
            },
            {
                model: models.tenants,
                include: [
                    {
                        model: models.specialConditions
                    }
                ]
            }
        ]

    }
    )
    return infos
}

// function that sends the lease contract by e-mail (services/email.service.js /sendLeaseAgreement) 
const pdfLeaseAgreementMail = async (tenantEmail) => {
    const tenant = await models.tenants.findOne({
        where: { email: tenantEmail}
        });
    if(!tenant || tenant.length === 0){
        throw createError(404, "tenant not found")
    }
    const tenantContractName = tenant.firstname + tenant.lastname
    
    await emailService.sendLeaseAgreement(tenant.email, tenantContractName, tenant.fullname)
}


/*
function that generates the lease contract (to see the contract formatting/page function, see: utils/pdf.js)
this function is used in: services/tenants.service.js / updateCreatedTenantInfos) 
*/
const pdfLeaseAgreement = async (roomId) => {              

    const infos = await leaseAgreement(roomId)
    await pdfGenerator(infos)
    
}



module.exports = { leaseAgreement, pdfLeaseAgreement, pdfLeaseAgreementMail}