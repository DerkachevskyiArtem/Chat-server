const createHttpError = require('http-errors');
const axios = require('axios');
const { User, Chat, ChatMessage } = require('../db/models');
const ChatService = require('../services/chat.service');

module.exports.createChat = async (req, res, next) => {
  try {
    const {
      body,
      file = {},
      tokenData: { id: userId },
    } = req;

    const chat = await ChatService.createChat({
      ...body,
      userId,
      file,
    });

    const bot = await User.findOne({ where: { email: 'joke@bot.com' } });

    if (!bot) {
      const passwordHash = await bcrypt.hash('dummy_password', 10);
      const newBot = await User.create({
        firstName: 'Joke',
        lastName: 'Bot',
        email: 'joke@bot.com',
        password: passwordHash,
        imgSrc: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png',
        isMale: null,
      });

      await chat.addUser(newBot);
    } else {
      await chat.addUser(bot);
    }

    res.status(201).send({ data: chat });
  } catch (error) {
    next(error);
  }
};

module.exports.addUserToChat = async (req, res, next) => {
  try {
    const {
      params: { userId, chatId },
    } = req;

    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      throw createHttpError(404, 'Chat not found');
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    await chat.addUser(user);

    res.status(200).send({
      data: {
        user,
        chat,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserChats = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: {
        model: Chat,
        as: 'chats',
        through: { attributes: [] },
        include: {
          model: ChatMessage,
          as: 'messages',
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
      },
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const chatsWithLastMessages = user.chats.map((chat) => {
      if (!chat.messages || chat.messages.length === 0) {
        chat.lastMessage = null;
      } else {
        const lastMessage = chat.messages[0];
        chat.lastMessage = lastMessage
          ? {
              id: lastMessage.id,
              text: lastMessage.text,
              createdAt: lastMessage.createdAt,
            }
          : null;
      }
      delete chat.messages;
      return chat;
    });

    res.status(200).send({ data: chatsWithLastMessages });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      throw createHttpError(404, 'Chat not found');
    }

    await chat.destroy();

    res.status(200).send({ message: 'Chat deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports.renameChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      throw createHttpError(400, 'New name is required');
    }

    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      throw createHttpError(404, 'Chat not found');
    }

    chat.name = name;
    await chat.save();

    res.status(200).send({ data: chat });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserChatsWithLastMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: {
        model: Chat,
        as: 'chats',
        through: { attributes: [] },
        include: {
          model: ChatMessage,
          as: 'messages',
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
      },
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const chatsWithLastMessages = user.chats.map((chat) => {
      if (!chat.messages || chat.messages.length === 0) {
        chat.lastMessage = null;
      } else {
        chat.lastMessage = chat.messages[0];
      }
      return chat;
    });

    console.log(`DATA IS ${{ chatsWithLastMessages }}`);

    res.status(200).send({ data: chatsWithLastMessages });
  } catch (error) {
    next(error);
  }
};
