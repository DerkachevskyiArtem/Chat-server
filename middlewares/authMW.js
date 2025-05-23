const {
  CREATE_USER_SCHEMA,
  LOGIN_USER_SCHEMA
} = require('../validation/userSchemas');

module.exports.registrationMW = async (req, res, next) => {
  try {
    const { body } = req;

    const user = await CREATE_USER_SCHEMA.validate(body);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports.loginMW = async (req, res, next) => {
  try {
    const { body } = req;

    await LOGIN_USER_SCHEMA.validate(body);
    
    next();
  } catch (error) {
    next(error);
  }
};