import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Mail, User } from 'lucide-react';


const ProfilPage = () => {

  const {authUser,isUpdatingProfile,profileUpdate} = useAuthStore();
  const [selectedImage,setSelectedImage] = useState(null);

  const handleImageUpload = async(e)=>{
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async()=>{
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await profileUpdate({profilePic: base64Image})
      console.log('selectedImage',selectedImage)
    }
  }
  return (
   <div className="min-h-screen pt-16 px-4 sm:px-6">
  <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
    <div className="bg-base-300 rounded-xl p-4 sm:p-6 space-y-6 sm:space-y-8">
      
      {/* Profile Image Section */}
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="relative">
          <img
            src={selectedImage || authUser.profilPic || "/avatar.png"}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4"
          />
          <label
            htmlFor="avatar-upload"
            className={`absolute bottom-0 right-0 
              bg-base-content hover:scale-105
              p-2 rounded-full cursor-pointer 
              transition-all duration-200
              ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-base-200" />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUpdatingProfile}
            />
          </label>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400">
          {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
        </p>
      </div>

      {/* Info Section */}
      <div className="space-y-4 sm:space-y-6">
        <div>
          <div className="text-sm text-zinc-400 flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name
          </div>
          <p className="px-3 py-2 sm:px-4 sm:py-2.5 bg-base-200 rounded-lg border">
            {authUser?.fullName}
          </p>
        </div>

        <div>
          <div className="text-sm text-zinc-400 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </div>
          <p className="px-3 py-2 sm:px-4 sm:py-2.5 bg-base-200 rounded-lg border">
            {authUser?.email}
          </p>
        </div>
      </div>

      {/* Account Info */}
      <div className="mt-6 bg-base-300 rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
          Account Information
        </h2>
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between py-2 border-b border-zinc-700">
            <span>Member Since</span>
            <span>{authUser.createdAt?.split("T")[0]}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Account Status</span>
            <span className="text-green-500">Active</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

  )
}

export default ProfilPage