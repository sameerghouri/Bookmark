export default function FilterBar({
  tags,
  activeTag,
  onTagChange,
  search,
  onSearchChange,
  favoritesOnly,
  onFavoritesOnlyChange,
}) {
  return (
    <div className="filters">
      <div className="filters__row">
        <input
          className="filters__search"
          type="search"
          placeholder="Search by title…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search bookmarks by title"
        />

        <label className="toggle">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(event) => onFavoritesOnlyChange(event.target.checked)}
          />
          <span>Favorites only</span>
        </label>
      </div>

      <div className="tags" role="group" aria-label="Filter by tag">
        <button
          type="button"
          className={`tag ${activeTag === 'all' ? 'tag--active' : ''}`}
          onClick={() => onTagChange('all')}
        >
          All
        </button>

        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`tag ${activeTag === tag ? 'tag--active' : ''}`}
            onClick={() => onTagChange(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
