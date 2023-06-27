const express = require('express')
const buildingController = require('../controllers/buildings.controller')
const validate = require('../middleware/validate')
const auth = require('../middleware/authentification')
const buildingValidation = require('../validations/buildings.validation')

const router = express.Router()

router.get('/', auth, validate(buildingValidation.getBuildings), buildingController.getBuildings)
router.post('/newbuilding',auth, validate(buildingValidation.createNewBuilding), buildingController.createBuilding)
router
    .route('/:buildingId')
    .get(auth, validate(buildingValidation.getBuildingById), buildingController.getBuildingById)
    .patch(auth, validate(buildingValidation.updateInfoBuilding), buildingController.updateInfoBuilding)
    .delete(auth, buildingController.removeBuilding )



module.exports = router


/**
 * @swagger
 * tags:
 *   name: Buildings
 *   description: buildings management
 */

/**
 * @swagger
 * /building/newbuilding:
 *   post:
 *     summary: Create a new building
 *     tags:
 *       - Buildings
 *     security:
 *       - cookieAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: building data
 *         description: Building data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             buildingInfos:
 *               $ref: "#/components/schemas/Building"
 *             ownersIds:
 *               type: array
 *               items:
 *                 type: integer
 *             managersIds:
 *               type: array
 *               items:
 *                 type: integer
 *             companyId:
 *               type: integer
 *     responses:
 *       '201':
 *         description: New building created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Building"
 *               properties:
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       '400':
 *         description: Bad request - Invalid data provided
 *       '401': 
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error - Failed to create the building
 */


/**
 * @swagger
 * /building:
 *  get:
 *      summary: get all the buildings
 *      tags:
 *          - Buildings
 *      security:
 *          - cookieAuth: []
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Building"
 *          '401':
 *              description: Unauthorized
 *          '404':
 *              description: Not Found
 *          '500':
 *              description: Internal Server Error
 */



/**
 * @swagger
 * /building/{buildingId}:
 *  get:
 *      summary: get building by id
 *      tags:
 *          - Buildings
 *      security:
 *          - cookieAuth: []
 *      parameters:
 *          - in: path
 *            name: buildingId
 *            required: true
 *            schema:
 *              type: integer
 *              description: Building Id
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Building"
 *          '401':
 *              description: Unauthorized
 *          '404':
 *              description: Not Found
 *          '500':
 *              description: Internal Server Error
 *
 */


/**
 * @swagger
 * /building/{buildingId}:
 *  delete:
 *      summary: delete a building
 *      tags:
 *          - Buildings
 *      security:
 *          - cookieAuth: []
 *      parameters:
 *          - in: path
 *            name: buildingId
 *            required: true
 *            schema:
 *              type: integer
 *              description: Building id
 *      responses:
 *          '200':
 *              description: OK, resource deleted successfully
 *          '401':
 *              description: Unauthorized
 *          '404':
 *              description: Not Found
 *          '500':
 *              description: Internal Server Error
 */


/**
 * @swagger
 * /building/{buildingId}:
 *  patch:
 *      summary: update building's infos
 *      tags:
 *          - Buildings
 *      security:
 *          - cookieAuth: []
 *      paramaters:
 *          - in: path
 *            name: buildingId
 *            required: true
 *            schema:
 *              type: integer
 *              description: Building id
 *      responses:
 *          '200':
 *              description: OK, building updated successfully
 *          '401':
 *              description: Unauthorized
 *          '404':
 *              description: Not Found
 *          '500':
 *              description: Internal Server Error
 */

/**
 * @swagger
 *  tags:
 *       - Buildings
 * components:
 *  schemas:
 *   Building:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          example: Watercool
 *        addressStreet:
 *          type: string
 *          example: Ch. de Waterloo
 *        addressNumber:
 *          type: string
 *          example: 370
 *        addressCity:
 *          type: string
 *          example: SAINT-GILLES
 *        addressPostalCode:
 *          type: string
 *          example: 1060
 *        addressCountry:
 *          type: string
 *          example: Belgique
 *        electricity:
 *          type: string
 *        water:
 *           type: string
 *        gaz:
 *           type: string
 *        doorCode:
 *           type: string
 *        iban:
 *           type: string
 *           example: BE43 5675 5675
 *        bic:
 *           type: string
 *           example: BGGRREE
 *
 */