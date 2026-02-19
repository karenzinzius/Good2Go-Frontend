import MainLayout from "../layouts/MainLayout"
import { useState } from "react";
import ItemCard from "../components/ItemCard";

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

  const handleAddItem = (newItem: any) => {
    const itemWithOwner = {
      ...newItem,
      ownerUsername: currentUser?.username || "anonymous",
    };

    const updatedItems = [itemWithOwner, ...items];
    setItems(updatedItems);
    localStorage.setItem("posts", JSON.stringify(updatedItems));
  };

  const deletePost = (id: number) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  return (
    <MainLayout>

    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Posts</h2>

      <div className="grid gap-4 md:grid-cols-3 mt-6">
        {items
          .filter((item) => item.ownerUsername === currentUser?.username)
          .map((item) => (
            <ItemCard key={item.id} {...item} onDelete={deletePost} />
          ))}
      </div>
      <button
  onClick={() => (window.location.href = "/giveaway")}
  className="btn block mx-auto bg-primary hover:bg-green-800 text-white"
>
  Post New Item
</button>
    </div>
    </MainLayout>
  );
};

export default MyPostsPage;
