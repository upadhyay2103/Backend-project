import 'dotenv/config'
import connectDB from "./db/index.js"
import { app } from './app.js'

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server listening on port ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("connection failed !! ",error);
})




// below is one approach to connect to db by writing the code directly in index.js
/*import express from "express";

const app=express();

(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       
        app.on("error",(error)=>{
            console.log(error);
            throw error;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`app running on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.log(error);
        throw error;
    }
})()*/