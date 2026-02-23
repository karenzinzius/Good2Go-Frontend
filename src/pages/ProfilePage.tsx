import { useState } from 'react'

const ProfilePage = () => {
  // Load stored user or default empty
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [username, setUsername] = useState(storedUser.username || '')
  const [address, setAddress] = useState(storedUser.address || '')
  const [postalCode, setPostalCode] = useState(storedUser.postalCode || '')
  const [numPosts, setNumPosts] = useState(storedUser.numPosts || 0)
  const [profilePic, setProfilePic] = useState(storedUser.profilePic || '')

  // Handle image upload
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setProfilePic(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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
    alert('Profile updated')
  }

  // Default avatar letter
  const avatarLetter = !profilePic && username ? username[0].toUpperCase() : ''

  return (
    <div className="max-w-md mx-auto mt-10 bg-base-100 p-6 rounded-box shadow">
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-4">
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold mb-2">
            {avatarLetter || '?'}
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
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
  )
}

export default ProfilePage
