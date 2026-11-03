const getHostname = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export default function BookmarkItem({ bookmark, onToggleFavorite, onDelete, onEdit }) {
  const host = getHostname(bookmark.url);

  return (
    <li className={`bookmark ${bookmark.isFavorite ? 'bookmark--favorite' : ''}`}>
      <div className="bookmark__main">
        <div className="bookmark__top">
          <a
            className="bookmark__title"
            href={bookmark.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            {bookmark.title}
          </a>
          <span className="badge">{bookmark.tag}</span>
        </div>

        <a
          className="bookmark__url"
          href={bookmark.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {host}
        </a>
      </div>

      <div className="bookmark__actions">
        <button
          type="button"
          className={`icon-button star ${bookmark.isFavorite ? 'star--on' : ''}`}
          onClick={() => onToggleFavorite(bookmark._id)}
          aria-label={bookmark.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
          title={bookmark.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
        >
          {bookmark.isFavorite ? '★' : '☆'}
        </button>

        <button
          type="button"
          className="icon-button"
          onClick={() => onEdit(bookmark)}
          aria-label={`Edit ${bookmark.title}`}
          title="Edit"
        >
          ✎
        </button>

        <button
          type="button"
          className="icon-button icon-button--danger"
          onClick={() => onDelete(bookmark)}
          aria-label={`Delete ${bookmark.title}`}
          title="Delete"
        >
          🗑
        </button>
      </div>
    </li>
  );
}
