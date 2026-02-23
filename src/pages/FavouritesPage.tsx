import ItemCard from '../components/ItemCard'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'

// Mock items — in real app, this would come from backend
const allItems = [
  { id: 1, title: 'Chair', description: 'Wooden chair', location: 'Berlin', ownerUsername: 'Karen' },
  { id: 2, title: 'Lamp', description: 'Desk lamp', location: 'Hamburg', ownerUsername: 'Max' },
]

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState<typeof allItems>([])

  useEffect(() => {
    const favItems = allItems.filter(item => {
      const fav = localStorage.getItem(`fav-${item.id}`)
      return fav && JSON.parse(fav)
    })
    setFavourites(favItems)
  }, [])

  const handleDelete = (id: number) => {
    alert('You deleted this post (only works for your items)')
  }

  return (
    <div className="bg-base-200 min-h-screen">
      <TopNav />

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Favourites ❤️</h1>

        {favourites.length === 0 ? (
          <p className="opacity-70">You have no favourites yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {favourites.map(item => (
              <ItemCard
                key={item.id}
                {...item}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default FavouritesPage
