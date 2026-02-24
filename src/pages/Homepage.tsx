import MainLayout from "../layouts/MainLayout";
import SearchBar from "../components/SearchBar";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Item {
  id: number;
  title: string;
  description: string;
  location: string;
  category?: string;
  images?: string[];
  ownerUsername: string;
}

interface Message {
  id: number;
  text: string;
  fromUser: string;
  toUser: string;
  itemId: number;
  time: string;
}

const Homepage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;

  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem("posts");
    return saved ? JSON.parse(saved) : [];
  });

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Reserve logic
  const handleReserve = (item: Item) => {
    if (!isLoggedIn) {
      alert("Please login to reserve items");
      return;
    }

    setSelectedItem(item);
    setMessageText(`Hi, I want to reserve "${item.title}"`);
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedItem) return;

    const newMessage: Message = {
      id: Date.now(),
      text: messageText,
      fromUser: user?.username || "unknown",
      toUser: selectedItem.ownerUsername,
      itemId: selectedItem.id,
      time: new Date().toISOString(),
    };

    const saved = JSON.parse(localStorage.getItem("messages") || "[]");
    const updated = [...saved, newMessage];
    localStorage.setItem("messages", JSON.stringify(updated));

    setMessageText("");
    setSelectedItem(null);
    setIsMessageModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-base-200 px-4 pt-4 max-w-7xl mx-auto">
        {/* Hero / Welcome */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {isLoggedIn ? `Welcome, ${user.username} 👋` : "Give things a second life"}
          </h1>
          <p className="opacity-70">
            {isLoggedIn
              ? "Items available near you"
              : "Find free items near you. Reuse instead of waste."}
          </p>
        </div>

        {/* Search */}
        <SearchBar />

        {/* Posts */}
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          {items.length === 0 && (
            <p className="opacity-70 col-span-full">No items posted yet.</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="card bg-base-100 shadow p-3">
              <h3 className="font-bold">{item.title}</h3>
              <p>{item.description}</p>
              <p className="text-sm opacity-60">{item.location}</p>

              <button
                className="btn btn-sm mt-3 bg-purple-600 text-white"
                onClick={() => handleReserve(item)}
              >
                Reserve
              </button>

              {isLoggedIn && item.ownerUsername === user.username && (
                <button
                  className="btn btn-sm mt-2 bg-red-500 text-white"
                  onClick={() => {
                    const updated = items.filter((i) => i.id !== item.id);
                    setItems(updated);
                    localStorage.setItem("posts", JSON.stringify(updated));
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

        {/* CTA for logged-out users */}
        {!isLoggedIn && (
          <div className="text-center mt-10">
            <p className="mb-3 opacity-70">
              Want to give something away or chat with others?
            </p>
            <Link to="/signup" className="btn btn-primary">
              Create an account
            </Link>
          </div>
        )}

        {/* MESSAGE MODAL */}
        {isMessageModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
              <h3 className="font-bold mb-2">Send Message</h3>

              <textarea
                className="textarea textarea-bordered w-full"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              {selectedItem && (
                <p className="text-sm mb-2 opacity-70">
                  About: <strong>{selectedItem.title}</strong>
                </p>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setIsMessageModalOpen(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Homepage;