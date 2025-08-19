import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get)=>({
     messages:[],
     users:[],
     selectedUser:null,
     isUsersLoading:false,
     isMessagesLoading:false,

     getUsers: async()=>{
          set({isUsersLoading:true})
          try {
               
               const response = await axiosInstance.get('/messages/users')
               set({users: response.data});

          } catch (error) {
               toast.error(error.response?.data?.message || "Error fetching users");
          }finally{
               set({isUsersLoading:false});
          }
     },

     getMessages: async(userId)=>{
          set({isMessagesLoading:true});
          try {
               const response = await axiosInstance.get(`/messages/${userId}`);
               set({messages: response.data});

          } catch (error) {
               toast.error(error.response?.data?.message || "Error fetching messages");
          }finally {
               set({isMessagesLoading:false});
          }
     },

     sendMessage: async(messageData)=>{
          const {selectedUser,messages} = get()
          try {
               const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
               set({messages:[...messages,response.data]});
          } catch (error) {
            toast.error(error.response?.data?.message || "Error sending message");   
          }
     },

     subscribToMessages: ()=>{
          const {selectedUser} = get()
          if(!selectedUser) return;

          const socket = useAuthStore.getState().socket;
          socket.on("newMessage",(newMessage)=>{
               set({messages:[...get().messages,newMessage]})
          })
     },
     unSubscribeFromMessages:()=>{
          const socket = useAuthStore.getState().socket;
          socket.off('newMessage')
     },

     setSelectedUser:(selectedUser)=> set({selectedUser})
}))