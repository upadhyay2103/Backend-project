import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app=express()

// below are the list of middlewares

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static("public"))

// import routes

import userRouter from './routes/user.routes.js'

// routes declaration
app.use('/api/v1/users',userRouter)


export { app }