const chatRouter = require('express').Router();
const ChatController = require('../controllers/chatController');
const ChatMessageController = require('../controllers/chatMessageController');
const { checkAccessToken } = require('../middlewares/tokenMW');
const { imagesUpload } = require('../utils/multer');

chatRouter.post(
  '/',
  checkAccessToken,
  imagesUpload.single('chatImage'),
  ChatController.createChat
);
chatRouter.post('/:chatId/users/:userId', ChatController.addUserToChat);
chatRouter.get('/users/:userId', ChatController.getUserChats);

chatRouter.get('/:chatId/messages', ChatMessageController.getMessagesForChat);
chatRouter.delete('/:chatId', checkAccessToken, ChatController.deleteChat);
chatRouter.put('/:chatId', checkAccessToken, ChatController.renameChat);

chatRouter.get(
  '/users/:userId/chats',
  ChatController.getUserChatsWithLastMessages
);

module.exports = chatRouter;
