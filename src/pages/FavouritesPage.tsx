import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';

interface Item {
  id: number;
  title: string;
  description: string;
  location: string;
  category?: string;
  images?: string[];
  ownerUsername: string;
}

const FavouritesPage = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const [posts, setPosts] = useState<Item[]>([]);
  const [favourites, setFavourites] = useState<Item[]>([]);

  // Load all posts from localStorage
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    setPosts(savedPosts);
  }, []);

  // Load favourite posts
  useEffect(() => {
    const favItems = posts.filter(item => {
      const fav = localStorage.getItem(`fav-${item.id}`);
      return fav && JSON.parse(fav);
    });
    setFavourites(favItems);
  }, [posts]);

  const handleToggleFav = (item: Item) => {
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    const key = `fav-${item.id}`;
    const current = JSON.parse(localStorage.getItem(key) || 'false');
    localStorage.setItem(key, JSON.stringify(!current));

    // Update favourites immediately
    const favItems = posts.filter(p => JSON.parse(localStorage.getItem(`fav-${p.id}`) || 'false'));
    setFavourites(favItems);
  };

  const handleDelete = (id: number) => {
    const updatedPosts = posts.filter(item => item.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Favourites ❤️</h1>

        {favourites.length === 0 ? (
          <p className="opacity-70">You have no favourites yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {favourites.map(item => (
              <div key={item.id} className="card bg-base-100 shadow p-3 relative">
                <h3 className="font-bold">{item.title}</h3>
                <p>{item.description}</p>
                <p className="text-sm opacity-60">{item.location}</p>

                {/* Favourite toggle */}
                <button
                  className="absolute top-2 right-2 btn btn-sm btn-outline"
                  onClick={() => handleToggleFav(item)}
                >
                  ❤️
                </button>

                {/* Delete button (only owner) */}
                {item.ownerUsername === currentUser?.username && (
                  <button
                    className="btn btn-sm mt-2 bg-red-500 text-white"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FavouritesPage;