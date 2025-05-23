const createHttpError = require('http-errors');
const { RefreshToken } = require('../db/models');
const { prepareUser } = require('../utils/user');
const JwtService = require('./token.service');

module.exports.createSession = async (user) => {
  const accessToken = await JwtService.createAccessToken({
    id: user.id,
  });

  const refreshToken = await JwtService.createRefreshToken({
    id: user.id,
  });

  await RefreshToken.create({ token: refreshToken, userId: user.id });

  const preparedUser = prepareUser(user);

  return { user: preparedUser, tokenPair: { accessToken, refreshToken } };
};

module.exports.refreshSession = async (tokenInstance) => {
  const user = await tokenInstance.getUser();

  if (!user) {
    throw new createHttpError(404, 'User not found.');
  }

  const accessToken = await JwtService.createAccessToken({
    id: user.id,
  });

  const refreshToken = await JwtService.createRefreshToken({
    id: user.id,
  });

  await tokenInstance.update({ token: refreshToken });

  const preparedUser = prepareUser(user);

  return { user: preparedUser, tokenPair: { accessToken, refreshToken } };
};
