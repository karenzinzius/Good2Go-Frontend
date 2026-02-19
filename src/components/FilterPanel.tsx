import { FaTags, FaMapMarkerAlt, FaLocationArrow } from 'react-icons/fa'

interface FilterPanelProps {
  onClear: () => void
}

const FilterPanel = ({ onClear }: FilterPanelProps) => {
  return (
    <div className="absolute right-0 mt-2 w-72 bg-base-100 shadow-lg rounded-xl p-4 z-50 transition-all duration-200 ease-out
    origin-top scale-100 opacity-100">
      {/* Categories */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium mb-1">
          <FaTags className="opacity-70" />
          Categories
        </label>
         <select className="select select-bordered w-full">
          <option value="">All categories</option>
          <option>Furniture</option>
          <option>Electronics</option>
          <option>Men Clothing/Shoes</option>
          <option>Women Clothing/Shoes</option>
          <option>Kids Clothing/Shoes</option>
          <option>Kids Toys</option>
          <option>Garden Equipments</option>
        </select>
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium mb-1">
          <FaMapMarkerAlt className="opacity-70" />
          Location
        </label>
        <input
          type="text"
          placeholder="City or postcode"
          className="input input-bordered w-full"
        />
      </div>

      {/* Radius */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-1">
          <FaLocationArrow className="opacity-70" />
          Radius
        </label>
        <select className="select select-bordered w-full">
          <option>5 km</option>
          <option>10 km</option>
          <option>25 km</option>
          <option>50 km</option>
        </select>
      </div>
      {/* CLEAR */}
      <button
        onClick={onClear}
        className="btn btn-ghost btn-sm w-full text-error"
      >
        Clear filters
      </button>
    </div>
  )
}

export default FilterPanel
