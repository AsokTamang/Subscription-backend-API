import express from "express";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.router.js";
import { authRouter } from "./routes/auth.router.js";
import { subscriptionRouter } from "./routes/subscription.js";
import dbConnection from "./databaseConnection/connection.js";
import errorHandler from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

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


app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subs", subscriptionRouter);

app.listen(PORT, async () => {
  //here we are using asynchronous function to connect with our mongo db
  await dbConnection();   //here we are importing the connection with our mongodb.
  console.log("server is running at port 5001");
});
