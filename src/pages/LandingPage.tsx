import SearchBar from '../components/SearchBar'
import ItemGrid from '../components/ItemGrid'
import { getUser } from '../utils/getUser'
import { Link } from 'react-router-dom'
import MainLayout from "../layouts/MainLayout"

const LandingPage = () => {
  const user = getUser()
  const isLoggedIn = !!user

  return (
    <MainLayout>
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 pt-4">
        {/* Hero text */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Give things a second life
          </h1>
          <p className="opacity-70">
            Find free items near you. Reuse instead of waste.
          </p>
        </div>

        <SearchBar />

        {/* Public items */}
        <ItemGrid isPublic />

        {/* CTA for logged-out users
        {!isLoggedIn && (
          <div className="text-center mt-10">
            <p className="mb-3 opacity-70">
              Want to give something away or chat with others?
            </p>
            <Link to="/signup" className="btn btn-primary">
              Create an account
            </Link>
          </div>
        )} */}
      </div>
    </div>
    </MainLayout>
  )
}

export default LandingPage
