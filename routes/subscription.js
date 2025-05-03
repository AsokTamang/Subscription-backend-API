import express from 'express'

export const subscriptionRouter=express.Router();

subscriptionRouter.get('/',(req,res)=>{
    res.send('Here is the list of all the subscribers.')
})

subscriptionRouter.put('/:id',(req,res)=>{
    res.send('update the specific subscriber detail.')
})

subscriptionRouter.delete('/:id',(req,res)=>{
    res.send('delete the specific subscriber.')
})

subscriptionRouter.post('/',(req,res)=>{
    res.send('create the subscriber detail.')
})

subscriptionRouter.put('/:id/cancel',(req,res)=>res.send('cancel the subscirption from the user'));

subscriptionRouter.get('/users/:id',(req,res)=>res.send('get the list of subscribers who are the users.'))
subscriptionRouter.get('/new-comingsubscribers',(req,res)=>res.send('Get the list of new coming subscribers.'))