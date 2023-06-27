const JWT = require('jsonwebtoken')
const util = require("util")
const dotenv = require("dotenv")

dotenv.config()
util.promisify(JWT.verify);

const jwtAuthentification = async (req, res, next) => {
    const token = await req.cookies.access_token;
    if (!token) {
        return res.status(401).send({ error: "authorized first" });
    }
    try {
        const decodedToken = JWT.decode(token);
        if (Date.now() >= decodedToken.exp * 1000) {
          return res.status(401).send({ error: "Your session has expired. Connect first" });
        }
        const data = JWT.verify(token, process.env.SECRET_JWT)
        req.userId = data.id
        return next();
    } catch {
        return res.status(403)
    }
};

module.exports = jwtAuthentification