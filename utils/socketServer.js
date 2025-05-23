const { sendBotJoke } = require('./jokeBot.js');
const { ChatMessage, User } = require('../db/models');

module.exports = function initSocketServer(io) {
  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);

    socket.on('joinChatRoom', (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`🔹 Socket ${socket.id} joined chat ${chatId}`);
    });

    socket.on('newChatMessage', async (newMessageData) => {
      try {
        console.log('✉️ New message received:', newMessageData);

        const message = await ChatMessage.create(newMessageData);
        const author = await User.findByPk(newMessageData.authorId);

        const messageToSend = {
          ...message.toJSON(),
          author: {
            id: author.id,
            firstName: author.firstName,
            lastName: author.lastName,
            imgSrc: author.imgSrc,
          },
        };

        io.to(`chat_${message.chatId}`).emit('newChatMessage', messageToSend);
        console.log(`📤 Message broadcasted to chat ${message.chatId}`);

        setTimeout(() => {
          sendBotJoke(io, message.chatId);
        }, 3000);
      } catch (error) {
        console.error('❗ Message processing error:', error);
        socket.emit('newChatMessageError', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });
};
