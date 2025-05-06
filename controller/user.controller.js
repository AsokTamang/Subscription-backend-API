import userModel from "../models/user.model.js";

export const getUsers=async(req,res,next)=>{
    try{
        const allUsers=await userModel.find().select('-password')   //here we are extracting all the users but removing the password field using .select('-password')
        return res.status(200).json({success:true,data:allUsers})

    }catch(Err){
        next(Err)
    }


}


export const getUser=async(req,res,next)=>{
    try{
        const{id}=req.params
        const User=await userModel.findById(id).select('-password');   //here we are extracting the user based on the id and removing the password field.
        if(!User){
            const ERROR=new Error('User doesnot exist.')
            res.status(409);
            throw ERROR;

        }
       
        return res.status(200).json({success:true,data:User})

    }catch(Err){
        next(Err)
    }


}



export const createUser=async(req,res,next)=>{    //this is for creating a new user.
 
        const newUser=req.body;
        if(!newUser.name||!newUser.email||!newUser.password){
            const ERROR=new Error('Please input all the fields.')
            res.status(500);
            throw ERROR;

        }
        try{
        const latestUser=new userModel(newUser);    
        const data=await latestUser.save();
       
        return res.status(200).json({success:true,data:data})

    }catch(Err){
        next(Err)
    }


}


export const updateeUser=async(req,res,next)=>{    //this is for creating a new user.
    const {id}=req.params;  //here we are destructuring the id from req.params
     const fields=req.body;
    if(!newUser.name||!newUser.email||!newUser.password){
        const ERROR=new Error('Please input all the fields.')
        res.status(500);
        throw ERROR;

    }
    try{
    const updatedUser=await userModel.findByIdAndUpdate(id,fields,{new:true})  //here new:true makes the new updated data to appear as soon as the data is updated.
    if(!updatedUser){
        const error=new Error('Couldnot update the user');
        res.status(404);
        throw error;
    }
    return res.status(200).json({success:true,updatedData:updatedUser})

}catch(Err){
    next(Err)
}


}


export const deleteUser=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const deletedUser=await userModel.findByIdAndDelete(id);   
        if(!deletedUser){
            const error=new Error('Couldnot delete the user');
            res.status(404);
            throw error;
        }
        return res.status(200).json({success:true,deletedData:deletedUser})

    }catch(Err){
        next(Err)
    }
}