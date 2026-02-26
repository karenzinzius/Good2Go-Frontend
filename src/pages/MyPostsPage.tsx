import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import AddItemForm from "../components/AddItemForm";

interface Item {
  id: number;
  title: string;
  description: string;
  location: string;
  category?: string;
  images?: string[];
  ownerUsername: string;
}

const MyPostsPage = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem("posts");
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddItem = (newItem: Item) => {
    const itemWithOwner = { ...newItem, ownerUsername: currentUser?.username || "anonymous" };
    const updatedItems = [itemWithOwner, ...items];
    setItems(updatedItems);
    localStorage.setItem("posts", JSON.stringify(updatedItems));
    setIsModalOpen(false);
  };

  const deletePost = (id: number) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  const handleToggleFav = (item: Item) => {
    if (!currentUser) return window.location.href = "/login";
    const key = `fav-${item.id}`;
    const current = JSON.parse(localStorage.getItem(key) || "false");
    localStorage.setItem(key, JSON.stringify(!current));
    setItems([...items]);
  };

  return (
    <MainLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Posts</h2>

        {/* Items grid */}
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          {items.map(item => (
            <div key={item.id} className="card relative bg-base-100 shadow p-3">
              {/* Image */}
              {item.images && item.images.length > 0 ? (
                <img src={item.images[0]} alt={item.title} className="w-full h-40 object-cover rounded-md mb-2" />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-2">No Image</div>
              )}

              <h3 className="font-bold">{item.title}</h3>
              <p>{item.description}</p>
              <p className="text-sm opacity-60">{item.location}</p>

              {/* Favourite */}
              <button
                className={`absolute top-2 right-2 btn btn-sm btn-outline ${JSON.parse(localStorage.getItem(`fav-${item.id}`) || "false") ? "bg-red-500 text-white" : ""}`}
                onClick={() => handleToggleFav(item)}
              >
                ❤️
              </button>

              {/* Delete button (owner only) */}
              {item.ownerUsername === currentUser?.username && (
                <button
                  onClick={() => deletePost(item.id)}
                  className="btn btn-sm mt-2 w-full bg-red-500 text-white"
                >
                  Delete 🗑
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Item Modal */}
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary w-full mt-6">Post New Item</button>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg w-full max-w-lg relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 btn btn-sm">✕</button>
              <AddItemForm onAdd={handleAddItem} />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyPostsPage;