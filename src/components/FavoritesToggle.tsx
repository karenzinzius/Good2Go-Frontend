interface FavoritesToggleProps {
  showFav: boolean;
  setShowFav: (val: boolean) => void;
}

const FavoritesToggle = ({ showFav, setShowFav }: FavoritesToggleProps) => (
  <button
    className="btn btn-sm btn-outline ml-2 mb-4"
    onClick={() => setShowFav(!showFav)}
  >
    {showFav ? "All Items" : "Favorites"}
  </button>
);

export default FavoritesToggle;
