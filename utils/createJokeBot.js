
const { User } = require('../db/models');
const bcrypt = require('bcrypt');

async function createJokeBot() {
  const existingBot = await User.findOne({ where: { email: 'joke@bot.com' } });

  if (!existingBot) {
    const passwordHash = await bcrypt.hash('dummy_password', 10);
    await User.create({
      firstName: 'Joke',
      lastName: 'Bot',
      email: 'joke@bot.com',
      password: passwordHash,
      imgSrc: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png',
      isMale: null,
    });
  }
}

module.exports = createJokeBot;
