import { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import AddItemForm from "../components/AddItemForm";
import Swal from "sweetalert2";

const MyPostsPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch real posts from DB on load
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/mine`, { withCredentials: true });
        setItems(res.data);
      } catch (err) {
        console.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  // 2. Add item (Triggered by AddItemForm)
  const handleAddItem = (newPostFromServer: any) => {
    setItems((prev) => [newPostFromServer, ...prev]);
    setIsModalOpen(false);
  };

  // 3. Toggle Status (Available -> Pending -> Taken)
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    let nextStatus = "available";
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
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4d4d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, { withCredentials: true });
        setItems(items.filter((item) => item._id !== id));
        Swal.fire("Deleted!", "Post removed.", "success");
      } catch (err) {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  return (
    <MainLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Posts</h2>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm">
            + Post New Item
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg"></span></div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 mt-6">
            {items.map((item) => (
              <div key={item._id} className="card relative bg-base-100 shadow-xl overflow-hidden">
                <figure>
                  <img src={item.images?.[0] || "https://via.placeholder.com/150"} alt={item.title} className="w-full h-40 object-cover" />
                </figure>
                <div className="card-body p-4">
                  <div className={`badge ${item.status === 'available' ? 'badge-success' : item.status === 'pending' ? 'badge-warning' : 'badge-ghost'} mb-2`}>
                    {item.status}
                  </div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm opacity-70 line-clamp-2">{item.description}</p>
                  
                  <div className="card-actions flex-col mt-4 gap-2">
                    <button onClick={() => handleToggleStatus(item._id, item.status)} className="btn btn-outline btn-xs w-full">
                      Mark as {item.status === 'available' ? 'Pending' : item.status === 'pending' ? 'Taken' : 'Available'}
                    </button>
                    <button onClick={() => deletePost(item._id)} className="btn btn-ghost btn-xs w-full text-error">
                      Delete 🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Item Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-base-100 p-6 rounded-2xl w-full max-w-lg relative shadow-2xl">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 btn btn-sm btn-circle">✕</button>
              <AddItemForm onAdd={handleAddItem} />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyPostsPage;

// import { useState } from "react";
// import MainLayout from "../layouts/MainLayout";
// import AddItemForm from "../components/AddItemForm";
// import axios from "axios";
// import Swal from "sweetalert2";

// interface Item {
//   id: number;
//   title: string;
//   description: string;
//   location: string;
//   category?: string;
//   images?: string[];
//   ownerUsername: string;
// }

// const MyPostsPage = () => {
//   const currentUser = JSON.parse(localStorage.getItem("user") || "null");

//   const [items, setItems] = useState<Item[]>(() => {
//     const saved = localStorage.getItem("posts");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const handleAddItem = (newItem: Item) => {
//     const itemWithOwner = { ...newItem, ownerUsername: currentUser?.username || "anonymous" };
//     const updatedItems = [itemWithOwner, ...items];
//     setItems(updatedItems);
//     localStorage.setItem("posts", JSON.stringify(updatedItems));
//     setIsModalOpen(false);
//   };

//   const deletePost = (id: number) => {
//     const updated = items.filter(item => item.id !== id);
//     setItems(updated);
//     localStorage.setItem("posts", JSON.stringify(updated));
//   };

//   const handleToggleFav = (item: Item) => {
//     if (!currentUser) return window.location.href = "/login";
//     const key = `fav-${item.id}`;
//     const current = JSON.parse(localStorage.getItem(key) || "false");
//     localStorage.setItem(key, JSON.stringify(!current));
//     setItems([...items]);
//   };

//   return (
//     <MainLayout>
//       <div className="p-4">
//         <h2 className="text-2xl font-bold mb-4">Posts</h2>

//         {/* Items grid */}
//         <div className="grid gap-4 md:grid-cols-3 mt-6">
//           {items.map(item => (
//             <div key={item.id} className="card relative bg-base-100 shadow p-3">
//               {/* Image */}
//               {item.images && item.images.length > 0 ? (
//                 <img src={item.images[0]} alt={item.title} className="w-full h-40 object-cover rounded-md mb-2" />
//               ) : (
//                 <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-2">No Image</div>
//               )}

//               <h3 className="font-bold">{item.title}</h3>
//               <p>{item.description}</p>
//               <p className="text-sm opacity-60">{item.location}</p>

//               {/* Favourite */}
//               <button
//                 className={`absolute top-2 right-2 btn btn-sm btn-outline ${JSON.parse(localStorage.getItem(`fav-${item.id}`) || "false") ? "bg-red-500 text-white" : ""}`}
//                 onClick={() => handleToggleFav(item)}
//               >
//                 ❤️
//               </button>

//               {/* Delete button (owner only) */}
//               {item.ownerUsername === currentUser?.username && (
//                 <button
//                   onClick={() => deletePost(item.id)}
//                   className="btn btn-sm mt-2 w-full bg-red-500 text-white"
//                 >
//                   Delete 🗑
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Add Item Modal */}
//         <button onClick={() => setIsModalOpen(true)} className="btn btn-primary w-full mt-6">Post New Item</button>
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-base-100 p-6 rounded-lg w-full max-w-lg relative">
//               <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 btn btn-sm">✕</button>
//               <AddItemForm onAdd={handleAddItem} />
//             </div>
//           </div>
//         )}
//       </div>
//     </MainLayout>
//   );
// };

// export default MyPostsPage;