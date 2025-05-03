import mongoose from "mongoose";

const userschema=new mongoose.Schema({
    name:{
        type:String,
        maxlength:50,
    minlength:5,
    required:[true,'Please enter a name.'],
    trim:true,
 
},
    email:{
        type:String,
        maxlength:50,
        minlength:5,
        required:[true,'Please enter an email.'],
        trim:true,
        match:[/\S+@\S+.\S+/,'please enter a valid email address.']   //here this code means the email must match the number of strings  before @ amd after that comes collection of string and . and same.
    },
    password:{
        type:String,
        minlength:6,
        required:[true,'Please enter a password.']
    },

},{
    timestamps:true
})

const userModel=mongoose.model('User',userschema);   //the name User will be converted into users by the mongodb automatocally which is in lowercase and plural.
export default userModel;