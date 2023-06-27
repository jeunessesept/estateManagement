const httpStatus = require('http-status')
const { userService, authService } = require('../services')
const catchAsync = require('../utils/catchAsync');





//// register a new user 
const register = catchAsync(async (req, res) => {
    const userBody = req.body;
    const user = await userService.registerService(userBody)
    res.status(httpStatus.CREATED).send(user);

})

///Login 
const loginWithEmail = catchAsync(async (req, res) => {
    const authBody = req.body;

    const { token, id, fullname, reset } = await authService.loginWithEmailService(authBody)

    res.cookie('access_token', token, {
        httpOnly: true,
    });
    res.status(httpStatus.OK).send({ info: { token, id, fullname }, reset })
});

// resetPassword (after the first connection)
const resetPassword = catchAsync(async (req, res) => {
    const { password, confirmPassword } = req.body
    const token = req.params.token
    const id = req.params.id
    await authService.resetPassword(id, token, password, confirmPassword)
    res.status(httpStatus.OK).json("password reset successfuly")

})

/// update password 
const updatePassword = catchAsync(async (req, res) => {
    const id = req.params.id;
    const newPassword = req.body.password;

    await authService.updatePasswordService({ id, newPassword });

    return res.status(httpStatus.OK).json({ message: 'password updated' });


});

const logout = (req, res) => {
    return res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Successfully logged out" });
};

module.exports = {
    loginWithEmail,
    register,
    updatePassword,
    resetPassword,
    logout
}

