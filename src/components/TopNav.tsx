import { Link } from "react-router-dom";
import { FaHeart, FaComments, FaPlus, FaUser, FaBars } from "react-icons/fa";
import MobileMenu from "./MobileMenu";
import { getUser } from "../utils/getUser";
import NavItem from "./NavItem";
import axios from "axios";

const TopNav = () => {
  const user = getUser();
  const isLoggedIn = !!user;
  const handleLogout = async () => {
  try {
    // 1. Tell backend to clear cookies
    await axios.delete("http://localhost:4000/api/auth/logout", { withCredentials: true });
    // 2. Clear local storage
    localStorage.removeItem("user");
    // 3. Refresh or Redirect
    window.location.href = "/";
  } catch (err) {
    console.error("Logout failed");
  }
};

  return (
    <div className="drawer drawer-end md:drawer-closed">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

      {/* PAGE CONTENT */}
      <div className="drawer-content">
        <div className="navbar bg-base-100 px-4 shadow-sm">
          {/* LEFT */}
          <div className="flex-1">
            <Link to="/" className="flex flex-col">
              <span className="text-xl font-bold text-primary">good2go</span>
              <span className="text-xs opacity-70">reuse • share • eco</span>
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6">
            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline btn-primary btn-sm"
                >
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <NavItem to="/">Home</NavItem>
                <NavItem to="/my-posts">
                  <FaPlus /> Posts
                </NavItem>
                <NavItem to="/favourites">
                  <FaHeart /> Favourites
                </NavItem>
                <NavItem to="/messages">
                  <FaComments /> Chats
                </NavItem>

                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-outline btn-primary btn-sm gap-2">
                    <FaUser />
                    <span>{user.username}</span>
                  </label>

                  <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44">
                    <li>
                      <Link to="/profile">Profile</Link>
                    </li>
                    <div className="divider my-1" />
                    <li>
                      <button
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden">
            <label htmlFor="mobile-drawer" className="btn btn-ghost btn-circle">
              <FaBars />
            </label>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div className="drawer-side">
        <label htmlFor="mobile-drawer" className="drawer-overlay"></label>
        <MobileMenu isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
};

export default TopNav;
