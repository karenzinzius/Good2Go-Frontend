import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SearchBar from "../components/SearchBar";
import PostCard from "../components/PostCard";
import { type FilterData } from "../components/FilterPanel";
import type { Post } from "../types/post";

const API_URL = import.meta.env.VITE_API_URL;

const Homepage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const [items, setItems] = useState<Post[]>([]);
  const [filteredItems, setFilteredItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedItem, setSelectedItem] = useState<Post | null>(null);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts`);
        setItems(res.data);
        setFilteredItems(res.data);
      } catch {
        console.error("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Search
  const handleSearch = (query: string) => {
    applyFiltersAndSearch(query, null);
  };

  // Filter
  const handleFilterChange = (filters: FilterData) => {
    applyFiltersAndSearch(null, filters);
  };

  const applyFiltersAndSearch = (
    searchQuery: string | null,
    filters: FilterData | null
  ) => {
    let result = [...items];

    const query = searchQuery ?? "";
    if (query.trim()) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters?.category) {
      result = result.filter((item) => item.category === filters.category);
    }

    if (filters?.location) {
      result = result.filter((item) =>
        item.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    setFilteredItems(result);
  };

  // Reserve flow
  const handleReserve = (item: Post) => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Login required",
        text: "Please log in to reserve items.",
        icon: "info",
        confirmButtonText: "Log in",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }
    setSelectedItem(item);
    setMessageText(`Hi! Is "${item.title}" still available? I'd love to pick it up.`);
    setIsMessageModalOpen(true);
  };

const handleSendMessage = async () => {
  // 1. Validation check
  if (!messageText.trim() || !selectedItem) return;

  try {
    // 2. Identification Logic (The Fallthrough)
    // Check every possible field name for the owner's ID
    const receiverId = 
      (selectedItem as any).ownerId || 
      (selectedItem as any).userId || 
      (selectedItem as any).owner?._id || 
      (selectedItem as any).owner;

    if (!receiverId) {
      console.error("SelectedItem details:", selectedItem);
      Swal.fire("Error", "We couldn't find who owns this item. Check console.", "error");
      return;
    }

    // 3. API Call
    await axios.post(
      `${API_URL}/api/messages`,
      { 
        receiverId, 
        postId: selectedItem._id, 
        text: messageText 
      },
      { withCredentials: true }
    );

    // 4. UI Cleanup
    Swal.fire({
      title: "Message Sent!",
      text: "The owner will see your request in their inbox.",
      icon: "success",
      confirmButtonColor: "#570df8",
    });
    
    setIsMessageModalOpen(false);
    setMessageText("");
    
  } catch (err: any) {
    console.error("XHR Error:", err.response?.data || err.message);
    Swal.fire("Error", "Server rejected the message. Are you logged in?", "error");
  }
};
         
  // Suggestion titles for search bar
  const suggestionTitles = items.map((i) => i.title);

  return (
    <MainLayout>
      <div className="min-h-screen bg-base-200 pb-16">
        <div className="max-w-7xl mx-auto px-4 pt-8">

          {/* Hero */}
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-primary">
              {isLoggedIn ? `Hey ${user.username}! ✨` : "Give things a second life"}
            </h1>
            <p className="opacity-60 text-base mt-1">
              {isLoggedIn
                ? "Check out what's new in your area today."
                : "Find free items near you. Reuse instead of waste."}
            </p>
          </div>

          {/* Search */}
          <SearchBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            suggestions={suggestionTitles}
          />

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-dots loading-lg" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="mt-16 text-center py-10 bg-base-100 rounded-2xl shadow-inner">
              <p className="text-xl opacity-40">No items found. 📦</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
              {filteredItems.map((item) => (
                <PostCard key={item._id} item={item} onReserve={handleReserve} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MESSAGE MODAL */}
      {isMessageModalOpen && selectedItem && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Contact Owner</h3>
            <p className="text-sm opacity-60 mb-3">
              About: <strong>{selectedItem.title}</strong>
            </p>
            <textarea
              className="textarea textarea-bordered w-full h-32"
              placeholder="Write your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <div className="modal-action">
              <button className="btn" onClick={() => setIsMessageModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSendMessage}>
                Send Message
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop bg-black/50"
            onClick={() => setIsMessageModalOpen(false)}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default Homepage; 