import { useState } from 'react'
import { FaFilter } from 'react-icons/fa'
import FilterPanel from './FilterPanel'

const SearchBar = () => {
  const [showFilters, setShowFilters] = useState(false)

  const handleClearFilters = () => {
  setShowFilters(false)
  }

  return (
    <div className="relative px-4 mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search items..."
          className="input input-bordered w-full"
        />

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-outline flex items-center gap-2"
        >
          <FaFilter />
          Filter
        </button>
      </div>

      {showFilters && (
        <div className="animate-[fadeIn_0.2s_ease-out]">
          <FilterPanel onClear={handleClearFilters} />
        </div>
      )}
    </div>
  )
}

export default SearchBar
