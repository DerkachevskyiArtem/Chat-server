const createHttpError = require('http-errors');
const { ChatMessage, User, Chat } = require('../db/models');
const axios = require('axios');


module.exports.getMessagesForChat = async (req, res, next) => {
  try {
    const {
      params: { chatId },
    } = req;

    const chat = await Chat.findByPk(chatId, {
      include: {
        model: ChatMessage,
        as: 'messages',
        include: {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName'],
        },
      },
      order: [[{ model: ChatMessage, as: 'messages' }, 'createdAt', 'ASC']],
    });

    if (!chat) {
      throw createHttpError(404, 'Chat not found');
    }

    return res.status(200).send({ data: chat.messages });
  } catch (error) {
    next(error);
  }
};
