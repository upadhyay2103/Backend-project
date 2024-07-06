import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const generateAccessAndRefreshToken=async(userId)=>{
    try {
        const user=User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken} 
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating tokens")
    }
}

const registerUser=asyncHandler( async(req,res)=>{
    // get user deatil from frontend
    // validation - not empty
    // check if user already exist: username and email
    // check for images , check for avatar      
    // upload them on cloudinary
    // create a user object -- create entry in db
    // remove password and refresh token fields from response
    // check for user creation
    // send response

    // step 1
    const {fullName,email,username,password}=req.body
    // console.log("email : ",email);

    // step2 - validation
    if([fullName,email,username,password].some(field=>field?.trim===""))
    {
        throw new ApiError(400,"All fields are requird !")
    }

    // step 3 check is user already exists
    const exUser=await User.findOne({
        $or:[{email},{username}]
    })

    if(exUser)
    {
        throw new ApiError(409,"User already exists")
    }

    // step 4 check for avatar
    const avatarLocalPath=req?.files?.avatar[0]?.path;
    // const coverImageLocalPath=req?.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0)
    {
        coverImageLocalPath=req.files.coverImage[0].path;
    }

    if(!avatarLocalPath)
    {
        throw new ApiError(400,"avatar image is required")
    }

    // step 5 upload images on cloudinary
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar)
    {
        throw ApiError(400,"avatar image is not uploaded")
    }

    // step 6 - create an object of user and make an entry in db
    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email:email.toLowerCase(),
        password,
        username:username.toLowerCase()
    })

    //step 8 check for user creation and remove password and refreshToken
    const createdUser=await User.findById(user._id).select(
            "-password -refreshToken"
    )

    if(!createdUser)
    {
        throw new ApiError(500,"something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"Successfully registered user")
    )

} )

const loginUser=asyncHandler( async(req,res)=>{
    // req->body
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const {email,username,password}=req.body
    
    if(!username || !email)
    {
        throw new ApiError(400,"atleast one of username and email is required")
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user)
    {
        throw new ApiError(404,"user does not exist")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid)
    {
        throw new ApiError(401,"password is not coorect")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

    // below we are fetching data again because new data has been added in the db regarding tokens
    const loggedInUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "user logged in successfully"
    )
} )

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie(accessToken,options)
    .clearCookie(refreshToken,options)
    .json(
        new ApiResponse(200,{},"Logged out successfully")
    )
})

export {registerUser,loginUser,logoutUser}