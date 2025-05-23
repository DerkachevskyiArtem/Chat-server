const createHttpError = require('http-errors');
const { Op } = require('sequelize');
const { Chat, User } = require('../db/models');

module.exports.createChat = async (chatData) => {
  const {
    userId,
    userIds,
    file: { filename },
    ...restChatData
  } = chatData;

  let user;

  if (userId) {
    user = await User.findByPk(userId);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }
  }

  
  const chat = await Chat.create({
    ...restChatData,
    chatImage: filename ? filename : null,
  });
  
  await user.addChat(chat);

  if (userIds) {
    const userIdsToFind = Array.isArray(userIds) ? userIds : userIds.split(',');

    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: userIdsToFind,
        },
      },
    });

    await chat.addUsers(users);
  }

  const chatWithUsers = await Chat.findByPk(chat.id, {
    include: {
      model: User,
      as: 'users',
      attributes: ['id','firstName', 'lastName'],
      through: {
        attributes: [],
      },
    },
  });

  return chatWithUsers;
};
