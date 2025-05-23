const userRouter = require('express').Router();
const UserController = require('../controllers/userController');
const {
  findUserById,
  createUserValidationMW,
  updateUserValidationMW,
} = require('../middlewares/usersMW');
const { imagesUpload } = require('../utils/multer');
const paginate = require('../middlewares/paginate');
const { checkAccessToken } = require('../middlewares/tokenMW');

userRouter.post(
  '/',
  imagesUpload.single('imgSrc'),
  createUserValidationMW,
  UserController.createUser
);
userRouter.get('/', checkAccessToken, paginate, UserController.getUsers);

userRouter.get('/:userId', findUserById, UserController.getUser);

userRouter.put(
  '/:userId',
  checkAccessToken,
  imagesUpload.single('imgSrc'),
  updateUserValidationMW,
  findUserById,
  UserController.updateUser
);

userRouter.delete('/:userId', findUserById, UserController.deleteUser);

module.exports = userRouter;
