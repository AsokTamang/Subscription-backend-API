import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config();

const dbConnection=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('mongo db connection successful.')

    }
    catch(Err){
        console.error(`${Err} error occured!`)
        process.exit(1);
    }
}
export default dbConnection;