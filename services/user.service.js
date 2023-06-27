const bcrypt = require('bcrypt');
const { models } = require("../models")
const createError = require("http-errors")

const bcryptSalt = process.env.BRCRYPT_SALT

const registerService = async (userBody) => {
    if (!userBody) {
        throw createError(400, 'Bad Request');
    }
    const hashedPassword = await bcrypt.hash(userBody.password, Number(bcryptSalt));
    const newUser = await models.users.create({
        firstname: userBody.firstname,
        lastname: userBody.lastname,
        phoneNumber: userBody.phoneNumber,
        email: userBody.email,
        password: hashedPassword
    });
    return newUser;

}

const getUsersService = async () => {
    const getUsers = await models.users.findAll();

    return getUsers;
};

const getUserById = async (userId) => {
    const user = await models.users.findByPk(userId);

    if (!user) {
        throw createError(404, 'user not found')
    }

    return user;
}


module.exports = { registerService, getUsersService, getUserById }