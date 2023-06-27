const express = require('express')
const authController = require('../controllers/auth.controller')
const validate = require('../middleware/validate')
const auth = require('../middleware/authentification')
const authValidation = require('../validations/auth.validation')
const router = express.Router()

router.post('/login', validate(authValidation.login), authController.loginWithEmail) // route to login
router.post('/register', auth, validate(authValidation.register), authController.register) // route to register a new user
router.patch('/password/:id', auth, validate(authValidation.updatePassword), authController.updatePassword) //route to update the password, user needs to be auth
router.patch('/password/id/:id/token/:token', validate(authValidation.resetPassword), authController.resetPassword) //route to reset the password after the first connection, user needs to be auth

router.get('/logout', auth, authController.logout) // route to logout 

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: registration and authentification 
 */

/** 
* @swagger
*   /auth/login:
*     post:
*       summary: Login with email and password
*       tags:         
*          - Auth
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 email:
*                   type: string
*                 password:
*                   type: string
*       responses:
*         '200':
*           description: Successful login
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   token:
*                     type: string
*                   id:
*                     type: integer
*                   fullname:
*                     type: string
*                   reset:
*                     type: boolean
*         '400':
*           description: Bad Request
*         '403':
*           description: Wrong password
*         '404':
*           description: User not found
*/

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             properties: 
 *               firstname:
 *                  type: string
 *               lastname:
 *                  type: string
 *               phoneNumber: 
 *                  type: string
 *               email: 
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *               password:
 *                  type: string
 *                  format: password
 *                  minLength: 8
 *                  description: must contain at least 1 capital letter, 1 number, and 1 special character
 *              
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  $ref: '#/components/schemas/User'
 *               example: 
 *                  firstname: John
 *                  lastname: Doe
 *                  email: john@test.com
 *                  password: password1
 *               
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /auth/password/id/{id}/token/{token}:
 *   patch:
 *     summary: Reset user password after first login
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: id
 *         type: integer
 *         description: User ID
 *         required: true
 *       - in: path
 *         name: token
 *         type: string
 *         description: Password reset token
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       403:
 *         description: Invalid token format or passwords don't match
 *       498:
 *         description: Invalid or expired password reset token
 */

/**
 * @swagger
 * /auth/logout:
 *  get: 
 *   summary: Logout user
 *   tags: 
 *     - Auth
 *   security: 
 *     - cookieAuth: []
 *   responses: 
 *     200:
 *       description: Succesfully looged out
 *       schema:
 *        type: object
 *        properties:
 *          message:
 *            type: string
 *            description: Logout message
 */
