import { useState, useRef, useEffect } from "react";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import FilterPanel, { type FilterData } from "./FilterPanel";

interface SearchBarProps {
  onSearch: (val: string) => void;
  onFilterChange: (filters: FilterData) => void;
  suggestions?: string[];
}

const SearchBar = ({ onSearch, onFilterChange, suggestions = [] }: SearchBarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = query.trim().length > 0
    ? suggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    setShowSuggestions(false);
  };

  const handleClearFilters = () => {
    setShowFilters(false);
    onFilterChange({});
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative px-4 mt-4">
      <div className="flex gap-2">
        {/* Input */}
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search items..."
            className="input input-bordered w-full pl-10 pr-9"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-opacity"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn ${showFilters ? "btn-primary" : "btn-outline"} flex items-center gap-2 shrink-0`}
        >
          <FaFilter />
          Filter
        </button>
      </div>

      {/* Suggestions overlay */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute left-4 right-16 mt-1 bg-base-100 border border-base-300 rounded-xl shadow-2xl z-50 overflow-hidden">
          {filteredSuggestions.map((s, i) => (
            <button
              key={i}
              className="w-full text-left px-4 py-2 text-sm hover:bg-base-200 transition-colors flex items-center gap-2"
              onMouseDown={() => handleSelectSuggestion(s)}
            >
              <FaSearch className="opacity-30" size={10} />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Filter panel */}
      {showFilters && (
        <div className="animate-[fadeIn_0.15s_ease-out]">
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