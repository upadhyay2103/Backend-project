import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB= async ()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n DB connected !! DB host : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('ERR: ',error);
        process.exit(1) //one way to move out of the process
    }
}

export default connectDB