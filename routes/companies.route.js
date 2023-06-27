const express = require('express')
const auth = require('../middleware/authentification')
const validate = require('../middleware/validate')
const companiesController = require('../controllers/companies.controller')
const companiesValidation = require('../validations/companies.validation')

const router = express.Router()

router.post('/newcompany', auth, validate(companiesValidation.createCompany), companiesController.createCompany)
// router.post('/:companyId/tobuilding/:buildingId', auth, companiesController.setCompanyToBuilding)   not really usefull anymore as the company are set during the building creation
router.get('/', auth, companiesController.getCompanies)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: companies management
 */

/**
 * @swagger
 * /company/newcompany:
 *  post: 
 *      summary: create a new company
 *      tags:
 *          - Companies
 *      security:
 *          - cookieAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Company'
 *      responses: 
 *          '201':
 *              description: company created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Company'
 *          '400':
 *              description: Bad Request
 *          '401':
 *              description: Unauthorized
 *          '500':
 *              description: internal server error
 */

/**
 * @swagger
 * /company/:
 *  get:
 *      summary: Get all companies
 *      tags:
 *          - Companies
 *      security:
 *          - cookieAuth: []
 *      responses:
 *          '201':
 *              description: Get data successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Company'
 */

/**
 * @swagger
 *  tags:
 *      - Companies
 * components:
 *  schemas:
 *    Company:
 *      type: object   
 *      properties: 
 *          name:
 *              type: string
 *              example: LIV-Y
 *          email:
 *              type: string
 *              example: livy@test.com
 *          siren:
 *              type: string
 *              example: BE 3453 3453 123
 *          tva:
 *              type: string
 *              example: BE 3453 3453 123
 *          addressStreet:
 *              type: string
 *              example: Ch. de Waterloo
 *          addressNumber:
 *              type: string
 *              example: 370
 *          addressPostCode:
 *              type: string
 *              example: 1060
 *          addressCity:
 *              type: string 
 *              example: SAINT-GILLES
 *          addressCountry:
 *              type: string
 *              example: Belgique
 */