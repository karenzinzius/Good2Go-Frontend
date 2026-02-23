import MainLayout from "../layouts/MainLayout"
import SearchBar from '../components/SearchBar'
import ItemGrid from '../components/ItemGrid'
import { getUser } from '../utils/getUser'

const DashboardPage = () => {
  const user = getUser()
  return (
    <MainLayout>
    <div className="bg-base-200 min-h-screen">
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold">
          Welcome{user?.username ? `, ${user.username}` : ''} 👋
        </h1>
        <p className="opacity-70">Items available near you</p>
      </div>

      <SearchBar />
      <ItemGrid />
    </div>
    </MainLayout>
  )
}

export default DashboardPage
