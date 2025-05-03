import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_TOKEN = process.env.JWT_TOKEN; //we are importing our secrect key and the date that this secret token expires which is down below.
const expiry = process.env.JWT_EXPIRES_IN;

const SignUp = async (req, res, next) => {
  const session = await mongoose.startSession(); //here we are assigning the start of mongoose session in the variable called session.
  session.startTransaction();
  try {
    const { name, email, password } = req.body; //here in this code , we are destructuring the name,email and password from req.body.
    const existingUser =await userModel.findOne({ email });
    if (existingUser) {
      const error = new Error("This email is already used by another user."); //we are assigning the new error with the given message.
      res.status(409); //here in this code , we are sending the response of 409.
      throw error; //and we are throwing this new error that we recently made.
    }
    //hassed password
    const salt = await bcrypt.genSalt(10);   //here we are creating a random strings which is called salt
    const hassedPw = await bcrypt.hash(password, salt);   //and in this code we are mixing those salts in our plain password text to create a new hassedpw.

    const newUsers =await userModel.create([{ name, email, password: hassedPw }], {
      session,
    }); //here we are creating a collection of users under this session which is a transaction. and we must always make them await as it returns the promise.
    //after creating the new user we must assign them a token which is shown below
    const token = jwt.sign({ userId: newUsers[0]._id}, JWT_TOKEN, {
      expiresIn: expiry, 
    });   //here in this code we are assigning the token value for this created user wiht jsonwebtoken's sign method passsing the userId , secretkey and the expiration date.
    await session.commitTransaction(); //here we are commiting the transaction i.e commiting all the operations done above.
    await session.endSession(); //here we are finally ending the mongoose session.
    res.status(200).json({
      //so that we can send the response of success and the data which consist of token and newuser.
      success: true,
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();    //this aborts the transaction.
    await session.endSession();    //this ends the session.
    next(error);   //it will pass the error in the next process.
  }
};

const SignIn = async (req, res, next) => {
 const{email,password}=req.body;   //we are destructuring the email and password from the req.body
 const user=await userModel.findOne({email});   //here we are making the mongoose to find the user with input email.
 if(!user){   //here we are checking if the user exist or not.
  const error=new Error('User doesnot exist.')
  res.status(400);
  throw error;
 }
 const checkPassword=await bcrypt.compare(password,user.password)    //here we are comparing the input password and the password of the matched user in db using bcrypt.compare
 if(!checkPassword){   //here we are checking if the password is valid or not.
   const error=new Error('Invalid password.')
   res.status(409);
   throw error;
 }
 const token=jwt.sign({userId:user._id},JWT_TOKEN,{expiresIn:expiry})   //here we are assignign the token in the signin operation.
 res.status(200).json({
  success:true,
  message:'Login successful',
  token,


 })


};

const SignOut = async (req, res, next) => {};

export { SignUp, SignIn, SignOut };
