import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/scoket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUser = async(req,res) =>{
  try {
    
    const loggedInUser = req.user._id
    const users = await User.find({_id:{$ne:loggedInUser}}).select('-password');
    // const users = await User.find() 
    // console.log(users,'flfjl')
     res.status(200).json(users)
  } catch (error) {
    console.log('getUser error',error);
    res.status(500).json({message:"Internal server error"})
  }
}

export const getMessages = async(req,res) =>{

  try {
    const {id:userChatId} = req.params
    const myId = req.user._id

    const messages = await Message.find({
      $or:[
        {senderId:myId,recieverId:userChatId},
        {senderId:userChatId,recieverId:myId}
      ]
    })

    res.status(200).json(messages)
  } catch (error) {
    console.log('getMessage error',error)
    res.status(500).json({message:"Internal server error"})
  }
}

export const sendMessage = async(req,res)=>{
  try {
    const {text,image} = req.body;
    const {id:recieverId} = req.params
    const senderId = req.user._id

    let imageUrl;
    if(image){
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url
    }

    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image:imageUrl
    });

    await newMessage.save()

    const recieverSocketId = getRecieverSocketId(recieverId);
    if(recieverId){
      io.to(recieverSocketId).emit('newMessage',newMessage)
    }

    res.status(201).json(newMessage)
  } catch (error) {
    console.log('sendMessage error',error)
    res.status(500).json({messsage:"Internal server error"})
  }
}