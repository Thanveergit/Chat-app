import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js ";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const { fullName, password, email } = req.body;
  try {
     if(!fullName || !password || !email){
           return res
        .status(400)
        .json({ message: "all fields are required" });
     }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    //finding the user email

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "email already exists" });
    }

    //hashing the passowrd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating new user

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    //creating the jwt token

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
          _id:newUser._id,
          fullName:newUser.fullName,
          email:newUser.email,
          profilePic:newUser.profilPic
      })
    }else{
    return res.status(400).json({message:"invalid user data"})
    }

  } catch (error) {
     console.log('error in signup controller',error);
     res.status(500).json({message:'Internal server error'})
  }
};

export const login = async(req, res) => {
     const {email,password} = req.body
     try {
          const user = await User.findOne({email});

          if(!user){
              return res.status(400).json({message:"Invalid email"})
          }
          
          const isMatch = await bcrypt.compare(password,user.password);
          if(!isMatch){
           return res.status(400).json({message:'password is incorrect'})
          }

          generateToken(user._id,res);

          res.status(200).json({
            _id:user._id,
            fullname:user.fullName,
            email:user.email,
            profilPic:user.profilPic
          })

     } catch (error) {
          console.log('user Login error',error);
          res.status(500).json({message:"internal server error"})
     }
};

export const logout = (req, res) => {
  try {
    res.cookie('jwt',"",{maxAge:0})
    res.status(200).json({message:"user logged out"})
  } catch (error) {
    console.log('error user logout',error);
    res.status(500).json({message:"internal server error"})
  }
};

export const updateProfile = async(req,res)=>{
  try {
    const {profilePic} = req.body;
    const userId = req.user._id

    if(!profilePic){
      return res.status(400).json({message:"Profile picture is required"})
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updaedUser = await User.findByIdAndUpdate(userId,{profilPic:uploadResponse.secure_url},{new:true});
    res.status(200).json({updaedUser})
  } catch (error) {
   console.log('error in update profile controller',error);
   res.status(500).json({message:"Internal server error"}) 
  }
}

export const checkAuth = (req, res) => {
 try {
  res.status(200).json(req.user)
 } catch (error) {
  console.log('error in checkAuth controller',error);
  res.status(500).json({message:"Internal server error"})
 }
}