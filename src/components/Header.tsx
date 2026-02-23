import { useNavigate, Link } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem('user')

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <header className="navbar px-6 lg:px-10 bg-base-100">
      <div className="flex-1">
        <Link to="/" className="text-xl font-semibold text-primary">
          good2go
        </Link>
      </div>

      <div className="flex-none gap-2">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="btn btn-ghost">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
