import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_TOKEN = process.env.JWT_TOKEN; //we are importing our secrect key and the date that this secret token expires which is down below.
const expiry = process.env.JWT_EXPIRES_IN;

const SignUp = async (req, res, next) => {
  const session=await mongoose.startSession();
  session.startTransaction();
  try{
    const{name,email,password}=req.body;
    const user=await userModel.findOne({email})// here we are trying to find the user through an email.
    if(user){
      await session.abortTransaction();
      await session.endSession();
      const error=new Error('This email is already taken')
      return res.status(500).json({error:error})
    }
    const salt=await bcrypt.genSalt(10);    //here we are generating the salt which we use for our password inorder for protection.
    const hassedPW=await bcrypt.hash(password,salt);
    const newUser=await userModel.create([{name,email,password:hassedPW}],{session})
    const token=jwt.sign({userId:newUser[0]._id},JWT_TOKEN,{expiresIn:expiry});  //here we only give the token after creating the user.
    await session.commitTransaction();  //then we are commiting the transaction.
    await session.endSession();   //then we are also ending the sesion.
    return (res.status(200).json({
      success:true,
      token,
      data:newUser,

    }))




  }
  catch(Err){
    await session.abortTransaction();
    await session.endSession();
    next(Err);
  }


}
const SignIn = async (req, res, next) => {
  try{
    const {email,password}=req.body;
    if(!email||!password){
      return res.status(409).json({success:false,message:'Email and Password are required.'})
    }
    const validUser=userModel.findOne({email}).select('-password')  //here we are trying to find the user data based on the input email.
    if(!validUser){
      return res.status(404).json({error:'User doesnot exist.'})

    }
    const validPW=await bcrypt.compare(password,validUser.password);  //here we are comparing the entered password and the actual password of the valid user.
    if(!validPW){
      return res.status(401).json({error:'Invalid password'})
    }
    //if all of the above conditions are false then we assign the signed in user a token.
    const token=jwt.sign({userId:validUser._id},JWT_TOKEN,{expiresIn:expiry})   //we are giving the token to the signed in user.
    return res.status(200).json({success:true,message:'successful signin.',token})


  }catch(Err){
    next(Err)
  }
};

const SignOut = async (req, res, next) => {};

export { SignUp, SignIn, SignOut };
