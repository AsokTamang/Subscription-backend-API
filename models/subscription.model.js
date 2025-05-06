import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 10,
      trim: true, //trim removes the whitespace between the characters
      required: [true, "Subscription name is required."],
    },
    price: {
      type: Number,
      min: [150, "Price must be greater than 150"],  //here we are settingt the minimum value of price to be 150.
      required: [true, "Price value is required."],
    },
    currency: {
      type: String,
      enum: ["USD", "CAD", "Rs"], //here enum sets the list of values that must be used.
      required: [true, "currency value is required."],
      default: "USD", //here the default value of usd is USD.
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: [true, "frequency value is required"],
    },
    category: {
      type: String,
      enum: ["sports", "entertainment", "tech", "science"],
      required: [true, "category value is required"],
    },
    payment: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startdate: {
      type: Date,
      required: [true, "Must input the start date."],
      validate: {
        validator: (value) => value <= new Date(),   //here validator is a function which is an arrow function that shows that the input date value must be before the present date.
        message: "The start date must be before or equal to the current date.",   //if the function returns false then this message is shown.
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startdate;    //here the renewal date value must be after the start date otherwise it returns false and shows the message below.
        }, //here validator is a function which checks the validity of the date entered by the user.
        message: "The renewal date must be after the start date.",
      },
    },
    user:{     //this is a model for the subscribed user.
      type:mongoose.Schema.Types.ObjectId,     //here we are using the existing object id from mongodb's usermodel as the reference is the 'User' which is a usermodel that we already created.    
      ref:'User',   //here User is a model name  
      required:true,
      index:true,
    }
   
  },
  {
    timestamps: true,
  }
);


subscriptionSchema.pre('save',function(){   //here this function will run before the subscriptionSchema is saved. 
  if(!this.renewalDate){
    const renewalPeriod={
      daily:1,
      weekly:7,
      monthly:30,
      yearly:365

    }
    this.renewalDate=new Date(this.startdate);  //here we are assigning the renewal date to the copy of start date for calculation.
    this.renewalDate.setDate(this.renewalDate.getDate()+renewalPeriod[this.frequency])   //in this code,we are first getting the value of this.renewal date and adding the renewalperiod based on this.frequency. which is done by this.renewalDate.set().
  }
  if(this.renewalDate<new Date()){   //here we are checking if the renewal date has passed the current date then it means the subscription is already expired.
    this.status='expired';
  }
  
})

const Subscription=mongoose.model('Subscriber',subscriptionSchema);  //here we are creating the collection named subscribers in our conneccted mongodb, as mongo db automatically converts the model name into plural and in lowercase.
export default Subscription;