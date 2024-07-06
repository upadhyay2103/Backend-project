import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'

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
    const exUser=User.findOne({
        $or:[{email},{username}]
    })

    if(exUser)
    {
        throw new ApiError(409,"User already exists")
    }

    // step 4 check for avatar
    const avatarLocalPath=req?.files?.avatar[0]?.path;
    const coverImageLocalPath=req?.files?.coverImage[0]?.path;

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

export {registerUser}