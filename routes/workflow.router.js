import express from 'express'
import { sendReminders } from '../controller/workFlow.controller.js';

 export const workflowRouter=express.Router();

workflowRouter.post('/subscription/reminder',sendReminders)