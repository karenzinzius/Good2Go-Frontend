import { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import SearchBar from "../components/SearchBar";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

const Homepage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // 1. Fetch Posts from DB
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts`);
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleReserve = (item: any) => {
    if (!isLoggedIn) {
      Swal.fire("Login Required", "Please login to reserve items", "info");
      return;
    }
    setSelectedItem(item);
    setMessageText(`Hi! Is "${item.title}" still available? I'd love to pick it up.`);
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedItem) return;

    try {
      // PRO TIP: Later we will build a real Messaging collection in MongoDB.
      // For now, we'll simulate success.
      console.log(`Message sent to ${selectedItem.ownerId}: ${messageText}`);
      
      Swal.fire("Sent!", "The owner has been notified.", "success");
      setIsMessageModalOpen(false);
      setMessageText("");
    } catch (err) {
      Swal.fire("Error", "Message failed to send", "error");
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-base-200 px-4 pt-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-primary">
            {isLoggedIn ? `Hey ${user.username}! ✨` : "Give things a second life"}
          </h1>
          <p className="opacity-70 text-lg">
            {isLoggedIn ? "Check out what's new in your area today." : "Find free items near you. Reuse instead of waste."}
          </p>
        </div>

        <SearchBar />

        {loading ? (
          <div className="flex justify-center py-20"><span className="loading loading-dots loading-lg"></span></div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 mt-8">
            {items.length === 0 ? (
              <div className="col-span-full text-center py-10 bg-base-100 rounded-xl shadow-inner">
                <p className="text-xl opacity-50">No available items found. 📦</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <figure className="h-48">
                    <img
                      src={item.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  
                  <div className="card-body p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="card-title text-xl font-bold">{item.title}</h3>
                      <div className="badge badge-secondary badge-outline">{item.category}</div>
                    </div>
                    <p className="text-sm opacity-70 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-1 text-xs opacity-60 mt-2">
                      📍 <span>{item.location}</span>
                    </div>

                    <div className="card-actions justify-end mt-4">
                      <button
                        className="btn btn-primary btn-block"
                        onClick={() => handleReserve(item)}
                      >
                        Reserve Item
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* MESSAGE MODAL */}
        {isMessageModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Contact Owner</h3>
              <textarea
                className="textarea textarea-bordered w-full h-32"
                placeholder="Write your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <div className="modal-action">
                <button className="btn" onClick={() => setIsMessageModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSendMessage}>Send Message</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Homepage;

// import MainLayout from "../layouts/MainLayout";
// import SearchBar from "../components/SearchBar";
// import { useState } from "react";

// interface Item {
//   id: number;
//   title: string;
//   description: string;
//   location: string;
//   category?: string;
//   images?: string[];
//   ownerUsername: string;
// }

// interface Message {
//   id: number;
//   text: string;
//   fromUser: string;
//   toUser: string;
//   itemId: number;
//   time: string;
// }

// const Homepage = () => {
//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const isLoggedIn = !!user;

//   const [items, setItems] = useState<Item[]>(() => {
//     const saved = localStorage.getItem("posts");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
//   const [messageText, setMessageText] = useState("");
//   const [selectedItem, setSelectedItem] = useState<Item | null>(null);

//   // Reserve logic
//   const handleReserve = (item: Item) => {
//     if (!isLoggedIn) {
//       alert("Please login to reserve items");
//       return;
//     }

//     setSelectedItem(item);
//     setMessageText(`Hi, I want to reserve "${item.title}"`);
//     setIsMessageModalOpen(true);
//   };

//   const handleSendMessage = () => {
//     if (!messageText.trim() || !selectedItem) return;

//     const newMessage: Message = {
//       id: Date.now(),
//       text: messageText,
//       fromUser: user?.username || "unknown",
//       toUser: selectedItem.ownerUsername,
//       itemId: selectedItem.id,
//       time: new Date().toISOString(),
//     };

//     const saved = JSON.parse(localStorage.getItem("messages") || "[]");
//     const updated = [...saved, newMessage];
//     localStorage.setItem("messages", JSON.stringify(updated));

//     setMessageText("");
//     setSelectedItem(null);
//     setIsMessageModalOpen(false);
//   };

//   return (
//     <MainLayout>
//       <div className="min-h-screen bg-base-200 px-4 pt-4 max-w-7xl mx-auto">
//         {/* Hero / Welcome */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold">
//             {isLoggedIn
//               ? `Welcome, ${user.username} 👋`
//               : "Give things a second life"}
//           </h1>
//           <p className="opacity-70">
//             {isLoggedIn
//               ? "Items available near you"
//               : "Find free items near you. Reuse instead of waste."}
//           </p>
//         </div>

//         {/* Search */}
//         <SearchBar />

//         {/* Posts */}
//         <div className="grid gap-4 md:grid-cols-3 mt-6">
//           {items.length === 0 && (
//             <p className="opacity-70 col-span-full">No items posted yet.</p>
//           )}
//           {items.map((item) => (
//             <div key={item.id} className="card bg-base-100 shadow p-3 relative">
//               {/* IMAGE */}
//               {item.images && item.images.length > 0 ? (
//                 <img
//                   src={item.images[0]}
//                   alt={item.title}
//                   className="w-full h-40 object-cover rounded-md mb-2"
//                 />
//               ) : (
//                 <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-2">
//                   No Image
//                 </div>
//               )}

//               <h3 className="font-bold">{item.title}</h3>
//               <p>{item.description}</p>
//               <p className="text-sm opacity-60">{item.location}</p>

//               <button
//                 className="btn btn-sm mt-3 bg-purple-600 text-white"
//                 onClick={() => handleReserve(item)}
//               >
//                 Reserve
//               </button>

//               {isLoggedIn && item.ownerUsername === user.username && (
//                 <button
//                   className="btn btn-sm mt-2 bg-red-500 text-white"
//                   onClick={() => {
//                     const updated = items.filter((i) => i.id !== item.id);
//                     setItems(updated);
//                     localStorage.setItem("posts", JSON.stringify(updated));
//                   }}
//                 >
//                   Delete
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* MESSAGE MODAL */}
//         {isMessageModalOpen && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
//               <h3 className="font-bold mb-2">Send Message</h3>

//               <textarea
//                 className="textarea textarea-bordered w-full"
//                 value={messageText}
//                 onChange={(e) => setMessageText(e.target.value)}
//               />
//               {selectedItem && (
//                 <p className="text-sm mb-2 opacity-70">
//                   About: <strong>{selectedItem.title}</strong>
//                 </p>
//               )}

//               <div className="mt-4 flex justify-end gap-2">
//                 <button
//                   onClick={() => setIsMessageModalOpen(false)}
//                   className="btn"
//                 >
//                   Cancel
//                 </button>
//                 <button className="btn btn-primary" onClick={handleSendMessage}>
//                   Send
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </MainLayout>
//   );
// };

// export default Homepage;
