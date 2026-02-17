import {
  FaMapMarkerAlt,
  FaRecycle,
  FaHeart,
  FaRegHeart,
  FaTrash,
  FaEnvelope,
} from "react-icons/fa";
import { useState, useEffect } from "react";

interface ItemCardProps {
  id: number;
  title: string;
  description: string;
  location: string;
  images?: string[];
  ownerUsername: string;
  onDelete?: (id: number) => void;
}

const ItemCard = ({
  id,
  title,
  description,
  location,
  images,
  onDelete,
  ownerUsername,
}: ItemCardProps) => {
  // Favorite persists in localStorage
  const [fav, setFav] = useState<boolean>(() => {
    const saved = localStorage.getItem(`fav-${id}`);
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(`fav-${id}`, JSON.stringify(fav));
  }, [fav, id]);

  const handleReserve = () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  if (!currentUser) {
    window.location.href = "/signup";
    return;
  }

  localStorage.setItem(
    "draftMessage",
    JSON.stringify({
      text: `Hi, I would like to reserve "${title}" (ID: ${id}).`,
      itemId: id,
      itemTitle: title,
      owner: ownerUsername,
    })
  );
  window.location.href = "/messages";
};


  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const isOwner = currentUser?.username === ownerUsername;

  return (
    <div className="card w-full md:w-80 bg-base-200 shadow-lg relative hover:shadow-xl transition-shadow duration-200">
      {/* Favorite button */}
      <button
        className="absolute top-4 right-4 text-red-500"
        onClick={() => {
          if (!currentUser) {
            window.location.href = "/signUp";
            return;
          }
          setFav(!fav);
        }}
        aria-label="Toggle favorite"
      >
        {fav ? <FaHeart /> : <FaRegHeart />}
      </button>


      {/* Image */}
      {images && images.length > 0 && (
        <div className="carousel w-full h-48">
    {images.map((img, index) => (
      <div key={index} className="carousel-item w-full">
        <img
          src={img}
          alt={`Image ${index}`}
          className="w-full h-48 object-cover"
          />
      </div>
    ))}
  </div>
)}

      <div className="card-body">
        {/* Title */}
        <h2 className="card-title flex items-center gap-2">
          <FaRecycle className="text-green-700" /> {title}
        </h2>

        {/* Description */}
        <p className="text-sm opacity-80">{description}</p>

        {/* Location → clickable Google Maps */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm opacity-70 hover:underline mt-2"
        >
          <FaMapMarkerAlt /> {location}
        </a>
      </div>

      {/* Reserve button */}
      <div className="mt-4 flex flex-col gap-2">
        {/* {!reserved ? ( */}
        <button className="btn btn-primary w-full" onClick={handleReserve}>
          <FaEnvelope />
          Reserve
        </button>
      </div>

      {/* Delete button */}
      {isOwner && onDelete && (
  <button
    className="btn btn-error w-full mt-3"
    onClick={() => onDelete?.(id)}
  >
    <FaTrash /> Delete
  </button>
)}

    </div>
  );
};

export default ItemCard;
