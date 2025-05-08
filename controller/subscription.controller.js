import Subscription from "../models/subscription.model.js";
import { workflowclient } from "../config/workflowClient.js";
import dotenv from 'dotenv'


dotenv.config()

export const createSubscriber=async(req,res,next)=>{
   
    const createdSubscriber = req.body;
    if(!createdSubscriber.name||!createdSubscriber.price||!createdSubscriber.category||!createdSubscriber.frequency||!createdSubscriber.status||!createdSubscriber.payment||!createdSubscriber.currency){
        const error=new Error('Please input all fields')
       return res.status(500).json({success:false,error:error});
       
    }
    try{
        const subscribers=await Subscription.create({...req.body,    //here we are creating a a newsubsciber using the subscriber model.
            user:req.user._id,   //this req.user._id comes from our auth middleware as in the authmiddleware we have passed req.user=user.

        })
      
        const qstashResponse=await workflowclient.trigger({   //we must use await for the workflow trigger to run.
            url:`${process.env.SERVER_URL}/api/v1/workflow/subscription/reminder`,
            headers:{
              'Content-Type':'application/json'  
            },
            body:JSON.stringify({subscriptionId:subscribers._id}),    //here we are passing the id of a newly created subscriber id.
            retries:0,
           
        })
        console.log(qstashResponse)
       
        res.status(200).json({success:true,data:subscribers,qstashResponse})
        
       //here we are checking if  the qstashResponse exist if it does then we respond with the messageId of qstash otherwise null.
        

    }catch(Err){
        next(Err);
    }
}

export const getSubscribers=async(req,res,next)=>{
    try{
        const totalSubscribers=await Subscription.find({});
        res.status(200).json({success:true,totalsubscibers:totalSubscribers})
        next();


    }catch(Err){
        next(Err)
    }
}

export const updateSubscribers=async(req,res,next)=>{
    const updatesubscriber = req.body;
    if(!updatesubscriber.name||!updatesubscriber.price||!updatesubscriber.category||!updatesubscriber.frequency||!updatesubscriber.status||!updatesubscriber.payment||!updatesubscriber.currency){
        const error=new Error('Please input all fields')
       return res.status(500).json({success:false,error:error});
       
    }
    try{
        const{id}=req.params;
        const fields=req.body;
        const updatedSubscriber=await Subscription.findByIdAndUpdate(id,fields,{new:true});
        res.status(200).json({success:true,updatedsubscirber:updatedSubscriber})
        next();


    }catch(Err){
        next(Err)
    }
}


export const deleteSubscribers=async(req,res,next)=>{

   
    try{
        const{id}=req.params;
        const deletedSubscriber=await Subscription.findByIdAndDelete(id);
        res.status(200).json({success:true,deletedsubscirber:deletedSubscriber})
        next();


    }catch(Err){
        next(Err)
    }
}

export const getownSubscribers=async(req,res,next)=>{
    if(req.params.id!==req.user._id){       //here we are checking if the id entered and the id of the user passed from authenticator is equal or not and we converted the object id of req.user into string
        return res.status(409).json({success:false,error:'You are not the owner of this site.'})

    }
    try{
        const getownSubscribers=await Subscription.find({user:req.params.id});
        res.status(200).json({success:true,ownsubsciber:getownSubscribers})



    }catch(Err){
        next(Err)
    }
}