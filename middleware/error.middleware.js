const errorHandler = (err, req, res, next) => {
  try {
    let error = { ...err }; //here we are just making the copy of err.
    error.message = err.message; //here we are assigning the message of err to error.

    //Invalid object Id
    if (err.name === "CastError") {
      const message = "Invalid ObjectId";
      error = new Error(message); //here we are creating a new Error object carrying the message of Invalid ObjectId.
      error.status = 404; //here 404 means not found.
    }
    //Duplicate key error
    if (err.code === 11000) {
      const message = "Duplicate key error";
      error = new Error(message);
      error.status = 400;
    }
    //Validation error
    if ((err.name = "Validation Error")) {
      // in the code below errors is the  property provided by the err obj,errors is created when there is any validation errors during the operations on mongooseSchema.
      const message = Object.values(err.errors).map((value) => value.message); //here the code Object.values(err.errors) return the list or array of the key-value pairs that are linked with validation errors and the map function will extract only the message part from this array and convert them into an array.        }
      error = new Error(message.join(", ")); //here this code message.join(', ') will join all the datas or messages value inside an array with , and space like 'name is required', 'price must be greater than 100'
      error.status = 400;
    }
    res //here after finishing to check the type of errors we are sending the response with status as well as the name of error.
      .status(error.status || 500) //here in this code we are sending the resposne of status with error.status or 500 if the error.status doesnot exist as 500 is an internal server error.
      .json({
        success: false,
        error: error.message || "Internal server error",
      }); //same here with the message.
  } catch (err) {
    //in this code if we catch any error then we proceed with the next function passing the catched err as a parameter.
    next(err);
  }
};
export default errorHandler;
