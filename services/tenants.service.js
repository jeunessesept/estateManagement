const { models } = require('../models')
const createError = require('http-errors')
const emailService = require('./email.service')
const leaseAgreementService = require('./leaseAgreement.service')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

const bcryptSalt = process.env.BCRYPT_SALT


const createTenant = async ( roomId, tenantInfos, specialCondition) => {       //// first step for the tenant register, the owner enter some infos then a form is send to the futur tenant where he/she enter more personal infos (for this step see => updateCreateTenantInfos)

    const room = await models.rooms.findOne({
        where: {
            id: roomId
        }
    })

    if (!room) {
        throw createError(404, 'Room not found')
    }

    // Create a new tenant with the provided information
    const newTenant = await models.tenants.create({...tenantInfos})

    // Create a special condition associated with the new tenant
    await models.specialConditions.create({
        title: specialCondition.title,
        content: specialCondition.content,
        tenantId: newTenant.id

    })
    
    // Associate the new tenant with the room
    await room.addTenant(newTenant)

    // Update the status of the room to "rented"
    await room.update({
        status : "rented"
    })


    // Return the newly created tenant and specialCondition
    return {
        newTenant,
        specialCondition
    }
}


// Function to update the information of a tenant after completing the registration form
const updateCreatedTenantInfos = async (tenantId, tenantInfos, token) => {
    // Find the registration token associated with the tenant
    let registrationToken = await models.tokens.findOne({where: {tenantId: tenantId}})
    // Throw an error if the token is invalid or not found
    if(!registrationToken){
        throw createError(404, 'invalid or not found token')
    }
    // Check if the provided token matches the token in the database and if it's not expired
    const isValid = await bcrypt.compare(token, registrationToken.token)
    if(!isValid || registrationToken.isExpired()){
        throw createError(498, "Invalid or expired password reset token")
    }
    // Find the tenant by their ID and include associated models
    const tenant = await models.tenants.findByPk(tenantId, {
        include: [
            {
                model: models.rooms,
                include: [
                    {
                        model: models.buildings,
                        include: [
                            {
                                model: models.users,
                                as: "managers"
                            }
                        ]
                    }
                ]
            }
        ]
    }
    )
    if(!tenant) {
        throw createError(404, "tenant not found")
    }
   
    
    const to = tenant.rooms[0].building.managers[0].email + ', ' + tenant.rooms[0].building.managers[1].email// Get the email addresses of the building managers
    const tenantName = tenant.firstname + ' ' +  tenant.lastname  // Get the tenant's full name
    const tenantFullname = tenant.firstname + tenant.lastname
    await tenant.update(tenantInfos)  // Update the tenant's information with the provided tenantInfos
    await emailService.sendTenantRegisterConfirmation(tenant.email, tenant.firstname)  // Send a tenant registration confirmation email
    await leaseAgreementService.pdfLeaseAgreement(tenant.rooms[0].id)  // Generate a PDF lease agreement for the tenant's room
    await emailService.sendLeaseAgreement(to, tenantFullname, tenantName) // Send the lease agreement to the building managers
    await tenant.update({isContractSend: true})                 //// - > when set to "true" it means that the contract has been sent to the tenant, so the front can check the value to display the tenant in the room or not 
    await registrationToken.destroy()               /// when the register form is sent the token is destroy, so the form is no longer available 
    return 

} 

// Function to request a registration form for a tenant
const registrationTenantFormRequest = async (tenantEmail) => {
    // Find the tenant by their email address
    const tenant = await models.tenants.findOne({
        where: { email: tenantEmail},
        attributes: ['id']
    })
    if(!tenant){
        throw createError(400, "bad request, email not valid")
    }

     // Find and destroy any existing token (if exists) associated with the tenant
    const token = await models.tokens.findOne({
        where: {tenantId: tenant.id}
    })
    if(token){
        await token.destroy()
    }
    // Generate a registration form token and hash it
    const registrationFormToken = crypto.randomBytes(32).toString('hex')
    const hash = await bcrypt.hash(registrationFormToken, Number(bcryptSalt))
     // Create a new token associated with the tenant
    await models.tokens.create({
        tenantId: tenant.id,
        token: hash
    })

    // Send the tenant registration form via email
    await emailService.sendTenantRegisterForm(tenantEmail, tenant.id, registrationFormToken)
    return {registrationFormToken, tenantId: tenant.id }
}


// Function to get all tenants
const getAllTenants = async () => {
    // Find all tenants in the database and include associated models
    const tenants = await models.tenants.findAll({
        include: [
            {
                model: models.specialConditions
            },
            {
            model: models.rooms,
            attributes: ['roomNumber'],
            include: [
                {
                    model: models.buildings,
                    attributes: ['name']
                }
            ]
        }]
    })

    if (!tenants) {
        throw createError(404, 'Not Found')
    }

    // Return the list of tenants
    return tenants
}


// Function to get a tenant by ID
const getTenantById = async (tenantId) => {
    // Find the tenant by their ID and include associated models
    const tenant = await models.tenants.findByPk(tenantId, {
        include: [
            {
                model: models.specialConditions
            },
            {
                model: models.rooms,
                include: [
                    {
                        model: models.charges,
                        as: 'typeOfIncCharges'
                    },
                    {
                        model: models.charges,
                        as: 'typeOfExcCharges'
                    }
                ]
            }
        ]
    })

    if (!tenant) {
        throw createError(404, 'Not Found')
    }

    // Return the tenant
    return tenant
}


// Function to get tenants by building
const getTenantsByBuilding = async (buildingId) => {
    // Find the building by its ID and include associated rooms
    const building = await models.buildings.findByPk(buildingId, {
        include: [
            {
                model: models.rooms,
                attributes: ['id', 'roomNumber'],
                include: [
                    {
                        model: models.tenants,
                        attributes: ['fullname']
                    }
                ]
            }
        ]
    });

    // Throw an error if the building or rooms are not found
    if (!building || !building.rooms || building.rooms.length === 0) {
        throw createError(404, 'Building or Rooms not Found');
    }

    // Extract the tenants per room information
    const tenantsPerBuilding = building.rooms.map((room) => {
        const tenants = room.tenants.map((tenant) => tenant.fullname);
        return {
            room,
            tenants,
        };
    });

    // Return the building and the list of tenants per room
    return {
        building,
        tenantsPerBuilding,
    };
};


const removeTenant = async (tenantId) => {
    const tenant =  await models.tenants.findByPk(tenantId)
    if(!tenant){
        throw createError(400, 'Bad Request')
    }
    await tenant.destroy()
}



module.exports = {
    createTenant,
    getAllTenants,
    getTenantById,
    getTenantsByBuilding,
    updateCreatedTenantInfos,
    registrationTenantFormRequest,
    removeTenant
}