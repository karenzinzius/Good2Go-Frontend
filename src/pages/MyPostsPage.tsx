import MainLayout from "../layouts/MainLayout";
import { useState } from "react";
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

interface Message {
  id: number;
  text: string;
  fromUser: string;
  toUser: string;
  itemId: number;
  time: string;
}

const MyPostsPage = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem("posts");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Add new item
  const handleAddItem = (newItem: any) => {
    const itemWithOwner = {
      ...newItem,
      ownerUsername: currentUser?.username || "anonymous",
    };

    const updatedItems = [itemWithOwner, ...items];
    setItems(updatedItems);
    localStorage.setItem("posts", JSON.stringify(updatedItems));
    setIsModalOpen(false);
  };

  // Delete post
  const deletePost = (id: number) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  // Reserve button opens message modal
  const handleReserve = (item: Item) => {
    const defaultMessage = `Hi, I want to reserve "${item.title}"`;
    setSelectedItem(item);
    setMessageText(defaultMessage);
    setIsMessageModalOpen(true);
  };

  // Send message
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedItem) return;

    const newMessage: Message = {
      id: Date.now(),
      text: messageText,
      fromUser: currentUser?.username || "unknown",
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
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Posts</h2>

        {/* Items grid */}
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          {items.map((item) => (
            <div key={item.id} className="card bg-base-100 shadow p-3">
              <h3 className="font-bold">{item.title}</h3>
              <p>{item.description}</p>
              <p className="text-sm opacity-60">{item.location}</p>

              {/* Reserve button */}
              <button
                onClick={() => handleReserve(item)}
                className="btn btn-sm mt-3 bg-purple-600 text-white"
              >
                Reserve
              </button>

              {/* Delete button (owner only) */}
              {item.ownerUsername === currentUser?.username && (
                <button
                  onClick={() => deletePost(item.id)}
                  className="btn btn-sm mt-2 bg-red-500 text-white"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Post new item */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn block mx-auto mt-6 bg-primary text-white"
        >
          Post New Item
        </button>

        {/* Add Item Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg w-full max-w-lg relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 btn btn-sm"
              >
                ✕
              </button>
              <AddItemForm onAdd={handleAddItem} />
            </div>
          </div>
        )}

        {/* Message Modal */}
        {isMessageModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
              <h3 className="font-bold mb-2">Send Message</h3>
              {selectedItem && (
                <p className="text-sm mb-2 opacity-70">
                  About: <strong>{selectedItem.title}</strong>
                </p>
              )}
              <textarea
                className="textarea textarea-bordered w-full"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setIsMessageModalOpen(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button onClick={handleSendMessage} className="btn btn-primary">
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

export default MyPostsPage;