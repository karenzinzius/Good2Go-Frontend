import { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import AddItemForm from "../components/AddItemForm";
import Swal from "sweetalert2";

// Align this interface with your Mongoose Model
interface IPost {
  _id: string;
  title: string;
  description: string;
  category: "Furniture" | "Electronics" | "Clothing" | "Books" | "Household" | "Other";
  location: string;
  images?: string[];
  status: "available" | "pending" | "taken";
  createdAt: string;
}

const MyPostsPage = () => {
  const [items, setItems] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch real posts from DB
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/mine`, { 
          withCredentials: true 
        });
        setItems(res.data);
      } catch (err) {
        console.error("Failed to load posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  // 2. Add item (Called when AddItemForm succeeds)
  const handleAddItem = (newPostFromServer: IPost) => {
    setItems((prev) => [newPostFromServer, ...prev]);
    setIsModalOpen(false); // Close modal on success
  };

  // 3. Toggle Status (Matches your specific logic)
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    let nextStatus: "available" | "pending" | "taken" = "available";
    if (currentStatus === "available") nextStatus = "pending";
    else if (currentStatus === "pending") nextStatus = "taken";

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}`,
        { status: nextStatus },
        { withCredentials: true }
      );
      setItems(items.map((item) => (item._id === id ? res.data : item)));
    } catch (err) {
      Swal.fire("Error", "Could not update status", "error");
    }
  };

  // 4. Delete Post
  const deletePost = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Post?",
      text: "This item will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4d4d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, { 
          withCredentials: true 
        });
        setItems(items.filter((item) => item._id !== id));
        Swal.fire("Deleted!", "Post removed.", "success");
      } catch (err) {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  return (
    <MainLayout>
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">My Posts</h2>
            <p className="opacity-60 text-sm italic">Manage the items you've shared</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn btn-primary shadow-lg"
          >
            + Post New Item
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="loading loading-heart loading-lg text-primary"></span>
            <p className="animate-pulse">Loading your items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
            <p className="text-xl opacity-50">You haven't posted anything yet!</p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-link">Start giving today</button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border border-base-200">
                <figure className="relative">
                  <img 
                    src={item.images?.[0] || "https://via.placeholder.com/400?text=No+Image"} 
                    alt={item.title} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className={`absolute top-2 right-2 badge border-none p-3 shadow-md ${
                    item.status === 'available' ? 'bg-success text-success-content' : 
                    item.status === 'pending' ? 'bg-warning text-warning-content' : 'bg-neutral text-neutral-content'
                  }`}>
                    {item.status.toUpperCase()}
                  </div>
                </figure>
                
                <div className="card-body p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="card-title text-lg leading-tight">{item.title}</h3>
                    <span className="text-[10px] opacity-40 uppercase font-bold">{item.category}</span>
                  </div>
                  <p className="text-sm opacity-70 line-clamp-2 mt-1">{item.description}</p>
                  
                  <div className="card-actions flex-col mt-4 gap-2">
                    <button 
                      onClick={() => handleToggleStatus(item._id, item.status)} 
                      className="btn btn-outline btn-sm w-full"
                    >
                      {item.status === 'available' ? 'Mark as Pending' : 
                       item.status === 'pending' ? 'Mark as Taken' : 'Re-list as Available'}
                    </button>
                    <button 
                      onClick={() => deletePost(item._id)} 
                      className="btn btn-ghost btn-xs w-full text-error hover:bg-error/10"
                    >
                      Delete Forever 🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="animate-in fade-in zoom-in duration-200 w-full max-w-lg">
              <AddItemForm 
                onAdd={handleAddItem} 
                onClose={() => setIsModalOpen(false)} 
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyPostsPage;