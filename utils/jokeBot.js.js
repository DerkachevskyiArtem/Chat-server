const axios = require('axios');
const https = require('https');
const { User, ChatMessage } = require('../db/models');

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

module.exports.sendBotJoke = async function (io, chatId) {
  try {
    const jokeBot = await User.findOne({ where: { email: 'joke@bot.com' } });

    if (!jokeBot) {
      console.error('Joke Bot not found');
      return;
    }

    const jokeResponse = await axiosInstance.get(
      'https://v2.jokeapi.dev/joke/Programming?type=single'
    );

    let jokeText;
    if (jokeResponse.data.type === 'twopart') {
      jokeText = `${jokeResponse.data.setup}\n\n${jokeResponse.data.delivery}`;
    } else {
      jokeText = jokeResponse.data.joke || jokeResponse.data.delivery;
    }

    const botMessage = await ChatMessage.create({
      text: jokeText,
      authorId: jokeBot.id,
      chatId,
    });

    const messageToSend = {
      ...botMessage.toJSON(),
      author: {
        id: jokeBot.id,
        firstName: jokeBot.firstName,
        lastName: jokeBot.lastName,
        imgSrc: jokeBot.imgSrc,
      },
    };

    io.to(`chat_${chatId}`).emit('newChatMessage', messageToSend);
    console.log('Joke Bot sent message to chat', chatId);
  } catch (error) {
    console.error('Joke Bot error:', error);
    io.to(`chat_${chatId}`).emit('newChatMessageError', {
      message: 'Failed to send bot joke',
      error: error.message,
    });
  }
};
