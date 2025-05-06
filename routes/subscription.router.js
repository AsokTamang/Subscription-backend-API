import express from 'express'
import { auth } from '../middleware/auth.middleware.js';
import { createSubscriber,getSubscribers,updateSubscribers,deleteSubscribers,getownSubscribers} from '../controller/subscription.controller.js';

export const subscriptionRouter=express.Router();

subscriptionRouter.get('/user/:id',auth,getownSubscribers) 
subscriptionRouter.get('/',auth,getSubscribers) 

subscriptionRouter.put('/:id',auth,updateSubscribers)

subscriptionRouter.delete('/:id',auth,deleteSubscribers)

subscriptionRouter.post('/',auth,createSubscriber);  //this is a create router.

subscriptionRouter.put('/:id/cancel',(req,res)=>res.send('cancel the subscirption from the user'));


subscriptionRouter.get('/new-comingsubscribers',(req,res)=>res.send('Get the list of new coming subscribers.'))