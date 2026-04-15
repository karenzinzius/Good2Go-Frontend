import { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../layouts/MainLayout';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;

export interface PostItem {
  _id: string; // MongoDB IDs are strings
  title: string;
  description: string;
  location: string;
  category: string;
  images: string[];
  ownerId: string;
  createdAt: string;
}

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch real favourites from DB
  useEffect(() => {
    const fetchFavs = async () => {
      try {
        // We call /me or a specific /favourites endpoint
        const res = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });
        // Assuming your backend populates the favourites array
        setFavourites(res.data.user.favourites || []);
      } catch (err) {
        console.error("Failed to fetch favourites");
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, []);

  const handleRemoveFav = async (postId: string) => {
    try {
      await axios.post(`${API_URL}/api/users/favourite`, 
        { postId }, 
        { withCredentials: true }
      );
      // Update UI: Remove the item from the state
      setFavourites(prev => prev.filter(item => item._id !== postId));
      
      Swal.fire({
        title: 'Removed!',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (err) {
      Swal.fire('Error', 'Could not remove favourite', 'error');
    }
  };

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Saved Items ❤️</h1>

        {loading ? (
          <span className="loading loading-dots loading-lg"></span>
        ) : favourites.length === 0 ? (
          <div className="text-center py-10">
             <p className="opacity-70">Nothing saved yet. Go find some treasures! 🚲</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {favourites.map(item => (
              <div key={item._id} className="card bg-base-100 shadow-xl overflow-hidden relative">
                {item.images?.[0] && (
                  <figure><img src={item.images[0]} alt={item.title} className="h-48 w-full object-cover" /></figure>
                )}
                <div className="card-body p-4">
                  <h3 className="card-title text-primary">{item.title}</h3>
                  <p className="text-sm line-clamp-2">{item.description}</p>
                  <div className="card-actions justify-between items-center mt-2">
                    <span className="badge badge-outline">{item.location}</span>
                    <button 
                      className="btn btn-circle btn-ghost text-red-500"
                      onClick={() => handleRemoveFav(item._id)}
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FavouritesPage;