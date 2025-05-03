import express from 'express'
import { SignUp,SignIn,SignOut } from '../controller/auth.controller.js';

export const authRouter=express.Router();

authRouter.post('/signup',SignUp)

authRouter.post('/signin',SignIn)

authRouter.post('/signout',SignOut)
