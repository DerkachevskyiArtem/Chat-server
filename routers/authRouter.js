const authRouter = require('express').Router();
const { imagesUpload } = require('../utils/multer');
const { loginMW, registrationMW } = require('../middlewares/authMW');
const AuthController = require('../controllers/authController');
const { checkRefreshToken } = require('../middlewares/tokenMW');

authRouter.post(
  '/registration',
  imagesUpload.single('imgSrc'),
  registrationMW,
  AuthController.registration
);

authRouter.post('/login', loginMW, AuthController.login);

authRouter.post('/refresh', checkRefreshToken ,AuthController.refreshSession);

module.exports = authRouter;
