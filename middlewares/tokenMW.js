const createHttpError = require('http-errors');
const { RefreshToken } = require('../db/models');
const JwtService = require('../services/token.service');

module.exports.checkAccessToken = async (req, res, next) => {
  try {
    const {
      headers: { authorization },
    } = req;

    if (!authorization) {
      throw createHttpError(401, 'Access token required');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
      throw createHttpError(401, 'Invalid token type');
    }

    const tokenData = await JwtService.verifyAccessToken(token);

    req.tokenData = tokenData;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports.checkRefreshToken = async (req, res, next) => {
  try {
    const {
      body: { refreshToken },
    } = req;

    const { id } = await JwtService.verifyRefreshToken(refreshToken);

    const foundToken = await RefreshToken.findOne({
      where: {
        token: refreshToken,
        userId: id,
      },
    });

    if (!foundToken) {
      throw new createHttpError(404, 'Token not found.');
    }

    req.tokenInstance = foundToken;

    next();
  } catch (error) {
    next(error);
  }
};
