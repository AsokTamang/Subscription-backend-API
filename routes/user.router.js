import express from 'express'
export const userRouter=express.Router();

userRouter.get('/',(req,res)=>res.send('Get all the users'))
userRouter.post('/',(req,res)=>res.send('Insert the user.'))
userRouter.put('/:id',(req,res)=>res.send('Update the user detail.'))
userRouter.delete('/:id',(req,res)=>res.send('Delete the user.'))

