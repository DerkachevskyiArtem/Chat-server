const createHttpError = require('http-errors');
const {
  UPDATE_USER_SCHEMA,
  CREATE_USER_SCHEMA,
} = require('../validation/userSchemas');
const { User } = require('../db/models');

module.exports.findUserById = async (req, res, next) => {
  try {
    const {
      params: { userId },
    } = req;

    const user = await User.findByPk(userId);

    if (!user) {
      throw createHttpError(404, `User with ID ${userId} not found`);
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports.createUserValidationMW = async (req, res, next) => {
  try {
    const { body } = req;

    const user = await CREATE_USER_SCHEMA.validate(body);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports.updateUserValidationMW = async (req, res, next) => {
  try {
    req.validatedBody = await UPDATE_USER_SCHEMA.validate(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
