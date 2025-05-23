const createHttpError = require('http-errors');
const bcrypt = require('bcrypt');
const { User, Chat } = require('../db/models');
const AuthService = require('../services/auth.service');

const createDefaultChatsForUser = async (userId) => {
  const defaultChats = [
    { name: 'General Chat' },
    { name: 'Project Discussion' },
    { name: 'Casual Talk' },
  ];

  try {
    const createdChats = await Chat.bulkCreate(defaultChats, {
      returning: true,
    });

    const chatIds = createdChats.map((chat) => chat.id);
   
    const user = await User.findByPk(userId);
    await user.addChats(chatIds);

    console.log(`Default chats created and linked for user ${userId}`);
  } catch (error) {
    console.error('Error creating default chats:', error);
    throw error;
  }
};

module.exports.registration = async (req, res, next) => {
  try {
    const { body, file } = req;

    const user = await User.create({
      ...body,
      imgSrc: file ? file.filename : null,
    });

    await createDefaultChatsForUser(user.id);

    const sessionData = await AuthService.createSession(user);

    res.status(201).send({ data: sessionData });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const {
      body: { email, password },
    } = req;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw createHttpError(404, 'User with this data not found');
    }

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (!isSamePassword) {
      throw createHttpError(404, 'User with this data not found');
    }

    const sessionData = await AuthService.createSession(user);

    res.status(201).send({ data: sessionData });
  } catch (error) {
    next(error);
  }
};

module.exports.refreshSession = async (req, res, next) => {
  try {
    const { tokenInstance } = req;

    const sessionData = await AuthService.refreshSession(tokenInstance);

    res.status(201).send({ data: sessionData });
  } catch (error) {
    next(error);
  }
};
