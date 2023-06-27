const express = require('express')
const auth = require('../middleware/authentification')
const validate = require('../middleware/validate')
const tenantsController = require('../controllers/tenants.controllers')
const tenantsValidation = require('../validations/tenants.validation')

const router = express.Router()

router.post('/newtenant/room/:roomId', auth, validate(tenantsValidation.createTenant), tenantsController.createTenant)
router.post('/registrationform', auth, tenantsController.registrationTenantFormRequest)
router.get('/', auth, validate(tenantsValidation.getAllTenants), tenantsController.getAllTenants)
router.get('/bybuilding/:buildingId', auth, validate(tenantsValidation.getTenantsByBuilding), tenantsController.getTenantsByBuilding)
router.put('/registration/:tenantId/token/:token', validate(tenantsValidation.updateCreatedTenantInfos), tenantsController.updateCreatedTenantInfos)
router 
      .route('/:tenantId')
      .get(auth, validate(tenantsValidation.getTenantById), tenantsController.getTenantById)
      .delete(auth, tenantsController.removeTenant )


module.exports = router


/**
 * @swagger
 * tags:
 *  name: Tenants
 *  description: Tenants management
 */



/**
 * @swagger
 * tags:
 *   - Tenants
 * components:
 *   schemas:
 *     Tenants:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         fullname:
 *           type: string
 *           example: John Doe
 *         firstname:
 *           type: string
 *           example: John
 *         lastname:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Must be unique
 *           example: johnDoe@test.com
 *         deposit:
 *           type: number
 *           example: 1700
 *         birthdate:
 *           type: string
 *           format: date
 *           example: 1999-01-01
 *         idNumber:
 *           type: string
 *           example: FR 234 234 234
 *         phoneNumber:
 *           type: string
 *           example: +32 498 48 48 48
 *         addressStreet:
 *           type: string
 *           example: rue Python
 *         addressNumber:
 *           type: string
 *           example: 5A
 *         addressCity:
 *           type: string
 *           example: Bruxelles
 *         addressPostalCode:
 *           type: string
 *           example: 1000
 *         addressCountry:
 *           type: string
 *           example: Belgique
 *         arrival:
 *           type: string
 *           format: date
 *           example: 2023-06-02
 *         contractStart:
 *           type: string
 *           format: date
 *           example: 2023-06-04
 *         contractEnd:
 *           type: string
 *           format: date
 *           example: 2024-06-04
 *         isContractSend:
 *           type: boolean
 */


/**
 * @swagger
 * tags:
 *  - specialCondition
 * components:
 *  schemas: 
 *      specialCondition:
 *          type: object
 *          properties:
 *              title:
 *                  type: string
 *                  example: stagiaire Ama
 *              content:
 *                  type: string
 *                  example: le locataire étant stagiaire chez Ama sa garantie locative ne s'élève qu'à une fois le montant du loyer                 
 */

/**
 * @swagger
 * /tenant/newtenant/room/:roomId:
 *  post:
 *      summary: Create a tenant related to a room. Just basic info, the real registration will be done by registration form sent to the tenant.
 *      tags:
 *          - Tenants
 *      security:
 *          - cookieAuth: []
 *      consumes: 
 *          - application/json
 *      produces: 
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: roomId
 *            required: true
 *            schema:
 *              type: integer
 *              description: ID of the room
 *          - in: body
 *            name: tenant data
 *            description: Tenant and specialConditions data (specialConditions are optional). 
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  tenantInfos:
 *                      type: object
 *                      properties:
 *                          firstname: 
 *                              type: string
 *                              example: John
 *                          lastname:
 *                              type: string
 *                              example: Doe
 *                          email:
 *                              type: string
 *                              format: email
 *                              example: johnDoe@test.com
 *                          deposit:
 *                              type: number
 *                              example: 1800
 *                          contractStart:
 *                              type: string
 *                              format: date
 *                              example: 2023-06-04
 *                          contractEnd: 
 *                              type: string
 *                              format: date
 *                              example: 2024-06-04
 *                  specialCondition:
 *                      $ref: '#/components/schemas/specialCondition'
 *      responses:
 *          '201':
 *              description: Tenant and their specialCondition created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              newTenant:
 *                                  properties:
 *                                      fullname:
 *                                          type: string
 *                                          description: fullname is a virtual field = firstname + lastname
 *                                          example: John Doe
 *                                      isContractSend:
 *                                          type: boolean
 *                                          example: false
 *                                      id:
 *                                          type: integer
 *                                          example: 1
 *                                      firstname:
 *                                          type: string
 *                                          example: John
 *                                      lastname:
 *                                          type: string
 *                                          example: Doe
 *                                      email: 
 *                                          type: string
 *                                          format: email
 *                                          example: johnDoe@test.com
 *                                      deposit:
 *                                          type: number
 *                                          example: 1800
 *                                      contractStart:
 *                                          type: string
 *                                          format: date
 *                                          example: 2023-06-04
 *                                      contractEnd:
 *                                          type: string
 *                                          format: date
 *                                          example: 2023-06-04
 *                              specialCondtion:
 *                                  $ref: '#/components/schemas/specialCondition'
 *                                 
 *          '401':
 *              description: Unauthorized
 *          '404':
 *              description: Not Found 
 *          '500':
 *              description: Internal Server Error    
 */

/**
 * @swagger
 * /tenant/registrationform:
 *  post:
 *      summary: Send a registration form to the future tenant by entering their email address in the request body.
 *      tags:
 *          - Tenants
 *      security:
 *          - cookieAuth: []
 *      parameters:
 *          - in: body
 *            name: email
 *            required: true
 *            schema:
 *              type: string
 *              format: email
 *              example: johnDoe@test.com
 *            description: Email address of the future tenant
 *      responses:
 *          '200':
 *              description: Successful response, email successfully sent
 *          '400':
 *              description: Bad request, email not valid
 *          '401':
 *              description: Unauthorized
 *          '500':
 *              description: Internal Server Error
 */

/**
 * @swagger
 * /tenant/:
 *  get:
 *      summary: Get all tenants
 *      tags:
 *          - Tenants  
 *      security:
 *          - cookieAuth: []
 *      responses:
 *          '200':
 *              description: Request successful
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              tenants:
 *                                  $ref: '#/components/schemas/Tenants'
 *                              rooms:
 *                                  type: object
 *                                  properties:
 *                                      roomNumber:
 *                                          type: string
 *                                          example: room 7
 *                              building:
 *                                  type: object
 *                                  properties:
 *                                      name:
 *                                          type: string
 *                                          example: Watercool
 */


/**
 * @swagger
 * /tenant/registration/:tenantId/token/:token:
 *  put:
 *      summary: form where the futur tenant register his infos (it's a put because the tenant is already create in the database by the owner/manager with some infos)
 *      tags:
 *          - Tenants
 *      security:
 *          - cookieAuth: []
 *      parameters:
 *          - in: path
 *            
 */
