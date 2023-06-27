const bcrypt = require("bcrypt")
const crypto = require('crypto')
const JWT = require("jsonwebtoken")
const util = require("util")
const { models } = require("../models")
const emailService = require('./email.service')
const createError = require("http-errors")


const sign = util.promisify(JWT.sign)
const bcryptSalt = process.env.BCRYPT_SALT

const loginWithEmailService = async (authBody) => {           // login with email and password
  if (!authBody) {
    throw createError(400, 'Bad Request');
  }
  const query = await models.users.scope('withPassword').findOne({
    where: { email: authBody.email },
  });

  if (!query) {
    throw createError(404, "user not found");
  }

  const match = await bcrypt.compare(authBody.password, query.password);

  if (match) {
    const token = await sign(
      { id: query.id, email: authBody.email },
      process.env.SECRET_JWT,
      {
        algorithm: 'HS512',
        expiresIn: '2h',
      }
    );
    let isPasswordResetRequired = false

    if (query.isPasswordResetRequired) {
      await requestResetPassword(query.id, query.email)
      isPasswordResetRequired = true
    }

    return { token, id: query.id, fullname: query.fullname, reset: isPasswordResetRequired };
  } else {
    throw createError(403, 'wrong password');
  }
};


// send a request password link with  a token (expires after 1 day)
const requestResetPassword = async (id, email) => {
  const token = await models.tokens.findOne({ where: { userId: id } })
  if (token) {
    await token.destroy();
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt))
  await models.tokens.create({
    userId: id,
    token: hash,
  })


  await emailService.sendResetPasswordEmail(email, resetToken, id);


  return {
    email,
    resetToken,
    id
  }
}

// reset password service
const resetPassword = async (id, token, password, confirmPassword) => {
  if (!token || typeof token !== 'string') {            
    throw createError(403, "Invalid token format");
  }
  let passwordResetToken = await models.tokens.findOne({ where: { userId: id } });
                                                                                         

  if (!passwordResetToken) {
    throw createError(404, "token not found")
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid || passwordResetToken.isExpired()) {
    throw createError(498, "Invalid or expired password reset token")
  }
  if (password !== confirmPassword) {
    throw createError(403, "passwords don't match")
  }

  const newHashedPassword = await bcrypt.hash(password, Number(bcryptSalt));
  await models.users.update(
    { password: newHashedPassword, isPasswordResetRequired: false },
    { where: { id: id } }
  );
  const user = await models.users.findOne({ where: { id: id } });
  await emailService.sendPasswordChangedConfirmation(user.email)
  await passwordResetToken.destroy()            // when the password is reset and the request is sent, the token is destroyed. The user no longer has access to this page. 

  return;
}


// another possibility for resetting the password without going through the e-mail stage (more direct way... ) 
const updatePasswordService = async ( id, newPassword ) => {
  const user = await models.users.findOne({ where: { id: id } });
  if (!user) {
    throw createError(404, 'user not found');
  }

  const newHashedPassword = await bcrypt.hash(newPassword, Number(bcryptSalt));
  await models.users.scope('withPassword').update({ password: newHashedPassword }, { where: { id: id } });

  return;

}

module.exports = {
  loginWithEmailService,
  updatePasswordService,
  requestResetPassword,
  resetPassword
};