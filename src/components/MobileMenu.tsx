import { Link } from 'react-router-dom'
import {
  FaHome,
  FaPlus,
  FaHeart,
  FaComments,
  FaClipboardList,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
} from 'react-icons/fa'

interface MobileMenuProps {
  isLoggedIn: boolean
}

const MobileMenu = ({ isLoggedIn }: MobileMenuProps) => {
  return (
    <ul className="menu p-4 w-64 min-h-full bg-base-100 text-base-content">
      {/* LOGO */}
      <li className="mb-4 text-lg font-bold text-primary">
        good2go
      </li>

      {/* NOT LOGGED IN */}
      {!isLoggedIn && (
        <>
          <li>
            <Link to="/login" className="flex items-center gap-2">
              <FaSignInAlt /> Login
            </Link>
          </li>
          <li>
            <Link to="/signup" className="flex items-center gap-2">
              <FaUser /> Register
            </Link>
          </li>
        </>
      )}

      {/* LOGGED IN */}
      {isLoggedIn && (
        <>
          <li>
            <Link to="/" className="flex items-center gap-2">
              <FaHome /> Home
            </Link>
          </li>

          <li>
            <Link to="/giveaway" className="flex items-center gap-2">
              <FaPlus /> Post item
            </Link>
          </li>

          <li>
            <Link to="/favourites" className="flex items-center gap-2">
              <FaHeart /> Favourites
            </Link>
          </li>

          <li>
            <Link to="/messages" className="flex items-center gap-2">
              <FaComments /> Chats
            </Link>
          </li>

          <li>
            <Link to="/my-posts" className="flex items-center gap-2">
              <FaClipboardList /> My Posts
            </Link>
          </li>

          <li>
            <Link to="/profile" className="flex items-center gap-2">
              <FaUser /> Profile
            </Link>
          </li>

          <div className="divider" />

          <li>
            <button
              className="flex items-center gap-2 text-error"
              onClick={() => {
                localStorage.removeItem('user')
                window.location.href = '/login'
              }}
            >
              <FaSignOutAlt /> Logout
            </button>
          </li>
        </>
      )}
    </ul>
  )
}

export default MobileMenu
