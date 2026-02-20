import MainLayout from "../layouts/MainLayout";
import AddItemForm from "../components/AddItemForm";
import { useState } from "react";

interface Item {
  id: number;
  title: string;
  description: string;
  location: string;
  category?: string;
  images?: string[];
  ownerUsername: string;
}

const GiveawayPage = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [items, setItems] = useState<Item[]>([]);

  const handleAddItem = (newItem: any) => {
    const itemWithOwner = {
      ...newItem,
      ownerUsername: currentUser?.username || "anonymous",
    };

    setItems((prev) => [itemWithOwner, ...prev]);
  };

  return (
    <MainLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Give Away an Item</h2>

        <AddItemForm onAdd={handleAddItem} />

        {/* Show preview of posts on this page */}
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          {items.map((item) => (
            <div key={item.id} className="card bg-base-100 shadow p-3">
              <h3 className="font-bold">{item.title}</h3>
              <p>{item.description}</p>
              <p className="text-sm opacity-60">{item.location}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default GiveawayPage;
