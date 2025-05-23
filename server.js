const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const serverConfig = require('./configs/server.json');
const { ChatMessage, User, Chat } = require('./db/models');
const axios = require('axios');
const createJokeBot = require('./utils/createJokeBot');

const PORT = serverConfig.PORT;
const HOST = serverConfig.HOST;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

createJokeBot();

const getRandomChat = async (userId) => {
  try {
    const chats = await Chat.findAll({
      include: [
        {
          model: User,
          as: 'users',
          where: { id: userId },
          required: true,
        },
      ],
    });

    if (!chats.length) {
      throw new Error(`No chats found for user: ${userId}`);
    }

    const randomIndex = Math.floor(Math.random() * chats.length);
    const randomChat = chats[randomIndex];

    return randomChat;
  } catch (error) {
    console.error('Error fetching random chat:', error);
    throw error;
  }
};

io.on('connection', (socket) => {
  socket.on('newChatMessage', async (newMessageData) => {
    try {
      const message = await ChatMessage.create(newMessageData);
      const author = await message.getAuthor();
      const messageToSend = message.toJSON();
      messageToSend.author = author;

      io.emit('newChatMessage', messageToSend);

      setTimeout(async () => {
        try {
          const bot = await User.findOne({ where: { email: 'joke@bot.com' } });

          if (bot) {
            const response = await axios.get(
              'https://v2.jokeapi.dev/joke/Any',
              {
                params: { type: 'single' },
              }
            );

            let jokeText = "Sorry, I couldn't fetch a joke right now.";

            if (response.data.error === false) {
              jokeText = response.data.joke;
            }

            const botMessage = {
              text: jokeText,
              chatId: newMessageData.chatId,
              authorId: bot.id,
              createdAt: new Date(),
              updatedAt: new Date(),
              isBot: true,
            };

            io.emit('newChatMessage', botMessage);

            await ChatMessage.create(botMessage);
          }
        } catch (error) {
          console.error('Error fetching joke:', error);
        }
      }, 3000);
    } catch (error) {
      console.error('Error processing new chat message:', error);
      socket.emit('newChatMessageError', error);
    }
  });

  socket.on('sendRandomMessage', async (userId) => {
    try {
      const randomChat = await getRandomChat(userId);

      if (!randomChat) {
        console.log('No chat found for user:', userId);
        return;
      }

      const bot = await User.findOne({ where: { email: 'joke@bot.com' } });

      const botMessage = {
        text: 'Hello! I am your friendly bot.',
        chatId: randomChat.id,
        authorId: bot.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isBot: true,
      };

      io.emit('newChatMessage', botMessage);

      await ChatMessage.create(botMessage);
    } catch (error) {
      console.error('Error sending random message:', error);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server started on port ${HOST}:${PORT}`);
});
