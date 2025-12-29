import express from 'express';

import userController from './userController.js';

const userRouter = express.Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.post('/updateUser', userController.updateUser);
userRouter.post('/deleteUser', userController.deleteUser);

// NEW secure routes
// userRouter.post('/refresh', userController.refreshToken);
userRouter.post('/logout', userController.logout);


export default userRouter;
