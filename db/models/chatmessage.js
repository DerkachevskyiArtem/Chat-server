'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Chat, User }) {
      ChatMessage.belongsTo(Chat, {
        foreignKey: 'chatId',
        as: 'chat',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      ChatMessage.belongsTo(User, {
        foreignKey: 'authorId',
        as: 'author',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // define association here
    }
  }
  ChatMessage.init(
    {
      text: {
        type: DataTypes.STRING(5000),
        allowNull: false,
      },
      authorId: {
        type: DataTypes.INTEGER,
        field: 'author_id',
        allowNull: false,
      },
      chatId: {
        type: DataTypes.INTEGER,
        field: 'chat_id',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ChatMessage',
      tableName: 'chat_messages',
      underscored: true,
    }
  );
  return ChatMessage;
};
