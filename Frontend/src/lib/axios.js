import axios from 'axios';

export const axiosInstance = axios.create({
     // baseURL:  "http://localhost:5001/api",
     baseURL: "https://chat-app-9-81hl.onrender.com/api",
     withCredentials:true
})