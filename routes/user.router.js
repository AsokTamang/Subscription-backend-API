import express from 'express'
import { getUsers,getUser,createUser,updateeUser,deleteUser } from '../controller/user.controller.js';
import { auth } from '../middleware/auth.middleware.js';

export const userRouter=express.Router();

userRouter.get('/',auth,getUsers)     //here we are using the imported auth middleware .
userRouter.get('/:id',auth,getUser)   //here we are also using the imported auth middleware that handles the authorization operation.
userRouter.post('/',createUser)
userRouter.put('/:id',updateeUser)
userRouter.delete('/:id',deleteUser)

