import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library';


const client=new OAuth2Client({clientId:`process.env.GOOGLE_CLIENT_ID`});
// @route   GET /api/products
// @desc    Get all products
// @access  Public
export const authUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email})
    if(user && (await user.matchPassword(password))){
        res.json({
            
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id)
        })}
    else{
        res.status(401)
        throw new Error('Email or password is incorrect');
    }
    
})
// export const googleAuthUser=asyncHandler(async(req,res)=>{
//     const {tokenId}=req.body;
//     client.verifyIdToken({idToken:tokenId,audience:process.env.GOOGLE_CLIENT_ID}).then(response=>{
//       const{email_verified,email,name}=response.payload;
//       if(email_verified){
//       const user= User.findOne(email);
//       if(user){
//         res.json({
//             _id:user._id,
//             name:user.name,
//             email:user.email,
//             isAdmin:user.isAdmin,
//             token:generateToken(user._id)
//         })
//       }
//       else{
//         let password=email+process.env.DEFAULT_PASSWORD;
//         let newUser= User.create({name,email,password});
//         if(newUser){
//         // res.status(201)
//         res.json({
//             _id:newUser._id,
//             name:newUser.name,
//             email:newUser.email,
//             isAdmin:newUser.isAdmin,
//             token:generateToken(newUser._id)
//         })
//     } else{
//         res.status(400)
//         throw new Error('User not created');
//     }

//       }

//     }
//     })
    
    
// })

//google authentication
// export const googleAuthUser=asyncHandler(async(req,res)=>{
//   const {tokenId}=req.body;
//   //  const bearer = req.header('Authorization');
//     // const [, ticket] = bearer.match(/Bearer (.*)/);
//   const ticket=await client.verifyIdToken({idToken:tokenId,audience:process.env.GOOGLE_CLIENT_ID});
//   const payload=ticket.getPayload();
//   // const{name,email}=payload;
//   const user= await User.findOne({email:payload?.email});
//   if(user){
//     res.status(200)
//     res.json({
//         _id:user._id,
//         name:user.name,
//         email:user.email,
//         isAdmin:user.isAdmin,
//         token:generateToken(user._id)
//     })}
//     else{
//         let password={email}+process.env.DEFAULT_PASSWORD;
//         let newUser= User.create({name,email,password});
//         if(newUser){
//         // res.status(201)
//         res.json({
//             _id:newUser._id,
//             name:newUser.name,
//             email:newUser.email,
//             isAdmin:newUser.isAdmin,
//             token:generateToken(newUser._id)
//         })
//     } else{
//         res.status(400)
//         throw new Error('User not created');
//     }
//   }
// })

export const authenticateUser = async (req, res) => {
  const { tokenId } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: `${process.env.GOOGLE_CLIENT_ID}`,
  });

  const payload = ticket.getPayload();

  let user = await User.findOne({ email: payload?.email });
  if (!user) {
    user = await new User({
      email: payload?.email,
      // avatar: payload?.picture,
      name: payload?.name,
      password: process.env.DEFAULT_PASSWORD+payload?.email,
    });

    await user.save();
  }

  res.json({ user, token });
};


// @route   GET /api/users
// @desc    Register user
// @access  Public
export const registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;
    const userExists=await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('User already exists');
    }
    const user=await User.create({name,email,password});
    if(user){
        res.status(201)
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id)
        })
    } else{
        res.status(400)
        throw new Error('User not created');
    }
    
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
 export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})