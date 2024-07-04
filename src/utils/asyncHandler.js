// below is one way to create a wrapper function and below it we have a second approach
const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}

export default asyncHandler

// const asyncHandler=()=>{}
// const asyncHandler=(fn)=()=>{}
// const asyncHandler=(fn)=async()=>{}


// below is the one way to create a wrapper function  
// const asyncHandler=(fn)=async(req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code||500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }
