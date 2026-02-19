interface CategoryFilterProps {
  selected: string;
  setSelected: (val: string) => void;
}

const categories = ["All", "Furniture", "Electronics", "Household"];

const CategoryFilter = ({ selected, setSelected }: CategoryFilterProps) => (
  <div className="flex gap-2 mb-6">
    {categories.map((cat) => (
      <button
        key={cat}
        className={`btn btn-sm ${selected === cat ? "btn-primary" : "btn-outline"}`}
        onClick={() => setSelected(cat)}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default CategoryFilter;
