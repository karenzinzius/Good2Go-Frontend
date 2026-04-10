import { useState } from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';
import FilterPanel, { type FilterData } from './FilterPanel';

interface SearchBarProps {
  onSearch: (val: string) => void;
  onFilterChange: (filters: FilterData) => void;
}

const SearchBar = ({ onSearch, onFilterChange }: SearchBarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  const handleClearFilters = () => {
    setShowFilters(false);
    onFilterChange({}); 
  };

  return (
    <div className="relative px-4 mt-4">
      <div className="flex gap-2">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
          <input
            type="text"
            placeholder="Search items..."
            className="input input-bordered w-full pl-10"
            value={query}
            onChange={handleInputChange}
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'} flex items-center gap-2`}
        >
          <FaFilter />
          Filter
        </button>
      </div>

      {showFilters && (
        <div className="animate-[fadeIn_0.2s_ease-out]">
          {/* We pass onFilterChange down to the panel */}
          <FilterPanel 
             onClear={handleClearFilters} 
             onApply={(filters: FilterData) => {
               onFilterChange(filters);
               setShowFilters(false);
             }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;