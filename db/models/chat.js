'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, ChatMessage }) {
      // define association here
      Chat.belongsToMany(User, {
        through: 'chats_to_users',
        foreignKey: 'chatId',
        as: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Chat.hasMany(ChatMessage, {
        foreignKey: 'chatId',
        as: 'messages',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Chat.init(
    {
      name: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      chatImage: {
        type: DataTypes.STRING(512),
        field: 'chat_image',
      },
    },
    {
      sequelize,
      modelName: 'Chat',
      tableName: 'chats',
      underscored: true,
    }
  );
  return Chat;
};
