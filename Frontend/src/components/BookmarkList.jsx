import BookmarkItem from './BookmarkItem';

export default function BookmarkList({
  bookmarks,
  loading,
  hasFilters,
  onToggleFavorite,
  onDelete,
  onEdit,
}) {
  if (loading) {
    return (
      <ul className="bookmark-list" aria-busy="true">
        {[1, 2, 3].map((item) => (
          <li className="bookmark skeleton" key={item}>
            <div className="skeleton__line skeleton__line--wide" />
            <div className="skeleton__line skeleton__line--short" />
          </li>
        ))}
      </ul>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon">🔖</span>
        <h3>{hasFilters ? 'No bookmarks match your filters' : 'No bookmarks yet'}</h3>
        <p>
          {hasFilters
            ? 'Try a different tag, or clear the search and favorites filter.'
            : 'Add your first link using the form to get started.'}
        </p>
      </div>
    );
  }

  return (
    <ul className="bookmark-list">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark._id}
          bookmark={bookmark}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
