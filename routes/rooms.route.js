const express = require('express')
const auth = require('../middleware/authentification')
const validate = require('../middleware/validate')
const roomsController = require('../controllers/rooms.controller')
const roomsValidation = require('../validations/rooms.validation')

const router = express.Router()

router.post('/building/:buildingId/newroom', auth,validate(roomsValidation.createRoom), roomsController.createRoom)
router.get('/', auth, validate(roomsValidation.getRooms), roomsController.getRooms )
router.get('/building/:buildingId/room', auth, validate(roomsValidation.getRoomsbyBuildingId), roomsController.getRoomsbyBuildingId)

router
    .route('/:roomId') 
    .get(auth, validate(roomsValidation.getRoomById), roomsController.getRoomById)
    .patch(auth, validate(roomsValidation.updateRoom), roomsController.updateRoom)

module.exports = router

/**
 * @swagger
 * tags:
 *  name: Rooms
 *  description: rooms management
 */

/**
 * @swagger
 * tags:
 *     - Rooms
 * components:
 *  schemas:
 *      Rooms:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  example: 1
 *              roomNumber:
 *                  type: string
 *                  example: room 7
 *              status:
 *                  type: string
 *                  enum: 
 *                      - rented
 *                      - free
 *                      - available from
 *              availableFrom:
 *                  type: date
 *                  example: 2024/02/21
 *              type: 
 *                  type: string
 *                  enum: 
 *                      - room
 *                      - flat
 *                      - studio
 *                      - office
 *                      - commerce
 *              rent:
 *                  type: number
 *                  example: 850
 *              charges:
 *                  type: number
 *                  example: 100
 *              rentReview:
 *                  type: date
 *                  example: 2024/03/22
 *              doorCode: 
 *                  type: string
 *                  example: C476
 */


/** 
 * @swagger
 * tags:
 *  - Charges
 * components:
 *  schemas:
 *      Charges:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  example: 1
 *              type: 
 *                  type: string
 *                  enum: ["eau", "gaz", "electricite", "internet"," nettoyage des communs"]
 */




/**
 * @swagger
 * /room/building/{buildingId}/newroom:
 *  post:
 *      summary: create a room related to a building
 *      tags:
 *          - Rooms
 *      security:
 *          - cookieAuht: []
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: buildingId
 *            required: true
 *            schema: 
 *              type: integer
 *              description: id of the building
 *          - in: body
 *            name: rooms data
 *            description: usefull data to create a room
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  roomInfos:
 *                      $ref: "#/components/schemas/Rooms"
 *                  typeCharges:
 *                      $ref: "#/components/schemas/Charges"
 *      responses:
 *          '201':
 *              description: room created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Rooms'
 *          '401':
 *              description: Unauthorized
 *          '404':
 *              description: Not found
 *          '500':
 *              description: Internal Server Error
 */

/**
 * @swagger
 * /room/{roomId}: 
 *  get:
 *    summary: Get room data by ID
 *    tags:
 *      - Rooms
 *    security:
 *      - cookieAuth: []
 *    parameters:
 *      - in: path
 *        name: roomId
 *        required: true
 *        schema:
 *          type: integer
 *        description: Room ID
 *    responses:
 *      '200':
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                roomsInfos:
 *                  $ref: '#/components/schemas/Rooms'
 *                typeOfIncCharges:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Charges'
 *                typeOfExcCharges:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Charges'
 *                tenants:
 *                  schemas:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: integer
 *                          example: 1
 *                      firstname:
 *                          type: string
 *                          example: John
 *                      lastname:
 *                          type: string
 *                          example: Doe
 *                      contractStart:
 *                          type: string
 *                          format: date
 *                          example: 2023-06-04
 *                      contractEnd:
 *                          type: string
 *                          format: date
 *                          example: 2024-06-04
 *      '401':
 *        description: Unauthorized
 *      '404':
 *        description: Not Found
 *      '500':
 *        description: Internal Server Error              
 */