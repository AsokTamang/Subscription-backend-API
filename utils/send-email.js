import dotenv from 'dotenv'
import { transporter } from '../config/nodemailer.js';
dotenv.config();
export const sendEmailReminder=async(to,subject,html)=>{
    const mailOptions={
        from:process.env.EMAIL,
        to,
        subject,
        html,
    }
    try{
    await transporter.sendMail(mailOptions);}    //here we are using the transporter which is made using the nodemailer provided by createTransport
    catch(error){
        console.log(error)
    }
}