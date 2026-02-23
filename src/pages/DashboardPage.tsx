import MainLayout from "../layouts/MainLayout"
import SearchBar from '../components/SearchBar'
import ItemGrid from '../components/ItemGrid'
import { getUser } from '../utils/getUser'

const DashboardPage = () => {
  const user = getUser()
  const isLoggedIn = !!user

  return (
    <MainLayout>
      <div className="bg-base-200 min-h-screen">
        <div className="px-4 pt-4 max-w-7xl mx-auto">
          {/* Personalized welcome */}
          <h1 className="text-2xl font-bold">
            {isLoggedIn ? `Welcome, ${user.username} 👋` : 'Welcome 👋'}
          </h1>
          <p className="opacity-70">Items available near you</p>
        </div>

        {/* Search bar */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <SearchBar />
        </div>

        {/* Items grid */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <ItemGrid />
        </div>
      </div>
    </MainLayout>
  )
}

export default DashboardPage
