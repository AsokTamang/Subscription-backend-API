import dotenv from "dotenv";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

dotenv.config();
const secretKey = process.env.JWT_TOKEN;

export const auth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; //this code splits the req.headers.authorization at the space' ' into an array consisting of a word Bearer and the actual token value.
    }
    if (!token) {
      const error = new Error("Invalid token");
      return res.status(404).json({ success: false, error: error });
    }
    const decoded = jwt.verify(token, secretKey); //here we are checking is the token verified or not.
    const validUser = await userModel.findById(decoded.userId); //here we are trying to find the user by using the signed user from userModel.
    if (!validUser) {
      const error = new Error("User doenot exist");
      return res.status(400).json({ success: false, error: error });
    }
    //if all of the above conditions are false then we proceed with the steps below
    req.user = validUser; //here we are attaching the validUser in the request as an object.
    next();
  } catch (Err) {
    next(Err);
  }
};
