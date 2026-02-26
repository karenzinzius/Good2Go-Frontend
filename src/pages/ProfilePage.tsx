import { useState, useRef } from 'react'
import MainLayout from "../layouts/MainLayout";

const ProfilePage = () => {
  // Load stored user or default empty
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [username, setUsername] = useState(storedUser.username || '')
  const [address, setAddress] = useState(storedUser.address || '')
  const [postalCode, setPostalCode] = useState(storedUser.postalCode || '')
  const [numPosts, setNumPosts] = useState(storedUser.numPosts || 0)
  const [profilePic, setProfilePic] = useState(storedUser.profilePic || '')
  const [toast, setToast] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  // Handle image upload
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setProfilePic(reader.result as string);
        showToast("Profile picture updated ✅");
      }
      reader.readAsDataURL(file)
    }
  };

  // 🗑 Handling Delete image
  const handleDeleteImage = () => {
    setProfilePic("");
    showToast("Profile picture removed 🗑");
  };

  // 💾 Save profile
  const handleSave = () => {
    const updatedUser = {
      ...storedUser,
      username,
      address,
      postalCode,
      numPosts,
      profilePic,
    }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    showToast("Profile saved successfully 🎉")
  };

  // 🔔 Toast helper
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  // Default avatar letter
  const avatarLetter = !profilePic && username ? username[0].toUpperCase() : '?';

  return (
    <MainLayout>
    <div className="max-w-md mx-auto mt-10 bg-base-100 p-6 rounded-box shadow relative">

      {/* 🔔 TOAST */}
      {toast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}

      <h2 className="text-xl font-bold mb-6 text-center">Profile</h2>

      {/* Profile Picture */}
      <div className="flex justify-center mb-6">
        <div className="relative group w-28 h-28">

          {/* Image / Avatar */}
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-2 border-base-300"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold">
              {avatarLetter}
            </div>
          )}

          {/* 📷 Camera */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 left-1 bg-black/70 hover:bg-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            📷
          </button>

          {/* 🗑 Delete */}
          {profilePic && (
            <button
              onClick={handleDeleteImage}
              className="absolute bottom-1 right-1 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              🗑
            </button>
          )}

          {/* Hidden input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleProfilePicChange}
          />
        </div>
      </div>

      {/* Username */}
      <label className="label">Username</label>
      <input
        className="input input-bordered w-full"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Address */}
      <label className="label mt-4">Address</label>
      <input
        className="input input-bordered w-full"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      {/* Postal Code */}
      <label className="label mt-4">Postal Code</label>
      <input
        className="input input-bordered w-full"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
      />

      {/* Number of Posts */}
      <label className="label mt-4">Number of Posts</label>
      <input
        type="number"
        className="input input-bordered w-full"
        value={numPosts}
        onChange={(e) => setNumPosts(Number(e.target.value))}
      />

      {/* Email (read-only) */}
      <label className="label mt-4">Email</label>
      <input
        className="input input-bordered w-full"
        value={storedUser.email || ''}
        disabled
      />

      <button className="btn btn-primary w-full mt-6" onClick={handleSave}>
        Save
      </button>
    </div>
    </MainLayout>
  )
}

export default ProfilePage
