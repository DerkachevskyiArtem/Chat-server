const jwt = require('jsonwebtoken');
const { promisify } = require('node:util');
const CONSTANTS = require('../constants');

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

const tokenConfig = {
  access: {
    secret: CONSTANTS.ACCESS_TOKEN_SECRET,
    expiresIn: CONSTANTS.ACCESS_TOKEN_EXPIRES_IN,
  },
  refresh: {
    secret: CONSTANTS.REFRESH_TOKEN_SECRET,
    expiresIn: CONSTANTS.REFRESH_TOKEN_EXPIRES_IN,
  },
};

const createToken = (payload, { secret, expiresIn }) =>
  jwtSign(payload, secret, {
    expiresIn,
  });

const verifyToken = (token, { secret }) => jwtVerify(token, secret);

module.exports.createAccessToken = (payload) =>
  createToken(payload, tokenConfig.access);
module.exports.verifyAccessToken = (token) =>
  verifyToken(token, tokenConfig.access);

module.exports.createRefreshToken = (payload) =>
  createToken(payload, tokenConfig.refresh);
module.exports.verifyRefreshToken = (token) =>
  verifyToken(token, tokenConfig.refresh);
