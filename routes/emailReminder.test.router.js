import express from 'express'
import { sendEmailReminder } from '../utils/send-email.js';
import dotenv from 'dotenv'


dotenv.config({path:'.env.production'})
console.log(process.env.EMAIL)

export const testRouter=express.Router();

testRouter.get('/test-email',async(req,res)=>{
    try{
    await sendEmailReminder(process.env.EMAIL,'We are testing our email reminder workflow','<h1>Hello world</h1>')
    res.status(200).json({success:true,message:'Email reminder workflow is working'})}
    catch(error){
        console.log(error)
        res.send(error)
    }


})