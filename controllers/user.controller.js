const { userService } = require('../services')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync');


const getUsers = catchAsync(async (req, res) => {
        const users = await userService.getUsersService()
        return res.status(httpStatus.OK).send(users)

})

const getUserById = catchAsync(async (req, res) => {
    const userId = req.userId;
        const user = await userService.getUserById(userId)
        return res.status(httpStatus.OK).send(user)
})

module.exports = {
    getUsers,
    getUserById
}





