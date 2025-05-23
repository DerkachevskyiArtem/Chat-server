const path = require('path');

const CONSTANTS = {
  PUBLIC_FOLDER_PATH: path.resolve(__dirname, 'public'),
  PASSWORD_REGEX: /^[a-zA-Z0-9!@#$%^&*()_+-=]{6,}$/,
  SALT_ROUNDS: 13,
  ACCESS_TOKEN_SECRET: 'sdjfhubf43b45rh33he940hr94hr93',
  ACCESS_TOKEN_EXPIRES_IN: '30s',
  REFRESH_TOKEN_SECRET: 'szdbvfvbrgvbficbg546rDKGejtg4Gryebvf237y4',
  REFRESH_TOKEN_EXPIRES_IN: '14d',
};

module.exports = CONSTANTS;
