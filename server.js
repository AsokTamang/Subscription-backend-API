import express from "express";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.router.js";
import { authRouter } from "./routes/auth.router.js";
import { subscriptionRouter } from "./routes/subscription.router.js";
import dbConnection from "./config/connection.js";
import errorHandler from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import { arcjetMiddleware } from "./middleware/arcject.middleware.js";
import { workflowRouter } from "./routes/workflow.router.js";


dotenv.config();

const PORT = process.env.PORT;
const app = express();
app.get("/", (req, res) => {
  res.send("Welcome to our rest api.");
});

app.use(express.json());
app.use(errorHandler);//here we are letting our app to use the errorHandler middleware.
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(arcjetMiddleware);   //here we are making our app to use arcjetmiddleware.


app.use("/api/v1/users", userRouter);// this is a user router.
app.use("/api/v1/auth", authRouter);  //this is an authorization router.
app.use("/api/v1/subs", subscriptionRouter);  //this is a subscription router.
app.use("/api/v1/workflow",workflowRouter);     //this is a workflow router.


app.listen(PORT, async () => {
  //here we are using asynchronous function to connect with our mongo db
  await dbConnection();   //here we are importing the connection with our mongodb.
  console.log("server is running at port 5001");
});
