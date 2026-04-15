import { useState, useRef } from "react";
import { FaTags, FaMapMarkerAlt, FaLocationArrow, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export interface FilterData {
  category?: string;
  location?: string;
  radius?: number;
}

interface FilterPanelProps {
  onClear: () => void;
  onApply: (filters: FilterData) => void;
}

const CATEGORIES = [
  "All",
  "Furniture",
  "Electronics",
  "Clothing",
  "Books",
  "Toys",
  "Sports",
  "Garden",
  "Kitchen",
  "Tools",
  "Other",
];

const RADIUS_PRESETS = [5, 10, 25, 50, 100];

const FilterPanel = ({ onClear, onApply }: FilterPanelProps) => {
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(25);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (dir: "left" | "right") => {
    if (!categoryScrollRef.current) return;
    categoryScrollRef.current.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
  };

  const handleApply = () => {
    onApply({
      category: category === "All" ? undefined : category,
      location: location.trim() || undefined,
      radius,
    });
  };

  const handleClear = () => {
    setCategory("All");
    setLocation("");
    setRadius(25);
    onClear();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-base-100 shadow-2xl rounded-2xl p-5 z-50 border border-base-300">

      {/* Categories */}
      <div className="mb-5">
        <label className="flex items-center gap-2 text-xs font-bold mb-2 opacity-60 uppercase tracking-wider">
          <FaTags /> Categories
        </label>
        <div className="relative flex items-center gap-1">
          <button
            onClick={() => scrollCategories("left")}
            className="btn btn-xs btn-ghost btn-circle shrink-0"
          >
            <FaChevronLeft size={10} />
          </button>

          <div
            ref={categoryScrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`btn btn-xs rounded-full shrink-0 ${
                  category === cat ? "btn-primary" : "btn-outline"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollCategories("right")}
            className="btn btn-xs btn-ghost btn-circle shrink-0"
          >
            <FaChevronRight size={10} />
          </button>
        </div>
      </div>

      {/* Location */}
      <div className="mb-5">
        <label className="flex items-center gap-2 text-xs font-bold mb-2 opacity-60 uppercase tracking-wider">
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
        <label className="flex items-center gap-2 text-xs font-bold mb-2 opacity-60 uppercase tracking-wider">
          <FaLocationArrow /> Radius —{" "}
          <span className="text-primary font-extrabold">{radius} km</span>
        </label>

        {/* Preset pills */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {RADIUS_PRESETS.map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`btn btn-xs rounded-full ${
                radius === r ? "btn-primary" : "btn-outline"
              }`}
            >
              {r} km
            </button>
          ))}
        </div>

        {/* Slider */}
        <input
          type="range"
          min={1}
          max={200}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="range range-primary range-xs w-full"
        />
        <div className="flex justify-between text-[10px] opacity-40 mt-1">
          <span>1 km</span>
          <span>200 km</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={handleApply} className="btn btn-primary btn-sm w-full">
          Apply Filters
        </button>
        <button onClick={handleClear} className="btn btn-ghost btn-sm w-full text-error">
          Clear all
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;