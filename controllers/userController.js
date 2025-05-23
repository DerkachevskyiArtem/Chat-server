const createHttpError = require('http-errors');
const { User } = require('../db/models');

module.exports.createUser = async (req, res, next) => {
  try {
    const { body, file } = req;

    const user = await User.create({
      ...body,
      imgSrc: file ? file.filename : null,
    });

    res.status(201).send({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { user } = req;

    await user.destroy();

    res.status(200).send({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const { pagination } = req;
    const users = await User.findAll({
      ...pagination,
    });

    res.status(200).send({ data: users });
  } catch (error) {
    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const { user } = req;
    res.status(200).send({ data: user });
  } catch (error) {
    next(error);
  }
};
module.exports.updateUser = async (req, res, next) => {
  try {
    const { user, validatedBody } = req;

    // const isMale = typeof validatedBody.isMale === 'string' && validatedBody.isMale === 'true' ? true : false; 

    const updatedUser = await user.update({
      ...validatedBody,
      // isMale,
      imgSrc: req.file ? req.file.filename : user.imgSrc,
    });

    res.status(200).send({ data: updatedUser });
  } catch (error) {
    next(error);
  }
};
