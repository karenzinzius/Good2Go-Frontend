import { useState } from 'react';
import { FaTags, FaMapMarkerAlt, FaLocationArrow } from 'react-icons/fa';

// Define the shape of our filters for TypeScript
export interface FilterData {
  category?: string;
  location?: string;
  radius?: string;
}

interface FilterPanelProps {
  onClear: () => void;
  onApply: (filters: FilterData) => void; // Fixed the 'any' error here
}

const FilterPanel = ({ onClear, onApply }: FilterPanelProps) => {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("25 km");

  const handleApply = () => {
    onApply({ category, location, radius });
  };

  return (
    <div className="absolute right-0 mt-2 w-72 bg-base-100 shadow-2xl rounded-xl p-4 z-50 border border-base-300">
      {/* Categories */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-bold mb-1 opacity-70">
          <FaTags /> Categories
        </label>
         <select 
           className="select select-bordered w-full select-sm"
           value={category}
           onChange={(e) => setCategory(e.target.value)}
         >
          <option value="">All categories</option>
          <option>Furniture</option>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Books</option>
          <option>Other</option>
        </select>
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-bold mb-1 opacity-70">
          <FaMapMarkerAlt /> Location
        </label>
        <input
          type="text"
          placeholder="City or postcode"
          className="input input-bordered w-full input-sm"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Radius */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-bold mb-1 opacity-70">
          <FaLocationArrow /> Radius
        </label>
        <select 
          className="select select-bordered w-full select-sm"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        >
          <option>5 km</option>
          <option>10 km</option>
          <option>25 km</option>
          <option>50 km</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={handleApply} className="btn btn-primary btn-sm w-full">
          Apply Filters
        </button>
        <button onClick={onClear} className="btn btn-ghost btn-sm w-full text-error">
          Clear all
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;