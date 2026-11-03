import { useEffect, useMemo, useState } from 'react';
import './App.css';
import BookmarkForm from './components/BookmarkForm';
import BookmarkList from './components/BookmarkList';
import FilterBar from './components/FilterBar';
import SummerScene from './components/SummerScene';
import {
  createBookmark,
  deleteBookmark,
  fetchBookmarks,
  getErrorMessage,
  toggleFavorite,
  updateBookmark,
} from './services/api';

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [knownTags, setKnownTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  // Fetch whenever the tag filter changes (or the user retries).
  useEffect(() => {
    let cancelled = false;

    fetchBookmarks(tagFilter)
      .then((data) => {
        if (cancelled) return;
        setBookmarks(data);
        setKnownTags((previous) =>
          Array.from(new Set([...previous, ...data.map((bookmark) => bookmark.tag)])).sort()
        );
        setError('');
      })
      .catch((requestError) => {
        if (!cancelled) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tagFilter, reloadToken]);

  const rememberTags = (...tags) => {
    setKnownTags((previous) =>
      Array.from(new Set([...previous, ...tags.filter(Boolean)])).sort()
    );
  };

  const handleTagChange = (tag) => {
    if (tag === tagFilter) return;
    setLoading(true);
    setError('');
    setTagFilter(tag);
  };

  const handleRetry = () => {
    setLoading(true);
    setError('');
    setReloadToken((token) => token + 1);
  };

  const visibleBookmarks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookmarks.filter((bookmark) => {
      if (favoritesOnly && !bookmark.isFavorite) return false;
      if (query && !bookmark.title.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [bookmarks, favoritesOnly, search]);

  const handleSave = async (payload) => {
    setSaving(true);

    try {
      if (editing) {
        const updated = await updateBookmark(editing._id, payload);
        setEditing(null);
        rememberTags(updated.tag);

        setBookmarks((current) => {
          // If the bookmark no longer matches the active tag, drop it from view.
          if (tagFilter !== 'all' && updated.tag !== tagFilter) {
            return current.filter((bookmark) => bookmark._id !== updated._id);
          }
          return current.map((bookmark) =>
            bookmark._id === updated._id ? updated : bookmark
          );
        });
      } else {
        const created = await createBookmark(payload);
        rememberTags(created.tag);

        if (tagFilter === 'all' || created.tag === tagFilter) {
          setBookmarks((current) => [created, ...current]);
        }
      }

      setError('');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFavorite = async (id) => {
    const previous = bookmarks;

    // Optimistic update so the star reacts immediately.
    setBookmarks((current) =>
      current.map((bookmark) =>
        bookmark._id === id ? { ...bookmark, isFavorite: !bookmark.isFavorite } : bookmark
      )
    );

    try {
      const updated = await toggleFavorite(id);
      setBookmarks((current) =>
        current.map((bookmark) => (bookmark._id === id ? updated : bookmark))
      );
    } catch (requestError) {
      setBookmarks(previous);
      setError(getErrorMessage(requestError));
    }
  };

  const handleDelete = async (bookmark) => {
    const confirmed = window.confirm(`Delete “${bookmark.title}”?`);

    if (!confirmed) return;

    try {
      await deleteBookmark(bookmark._id);
      setBookmarks((current) => current.filter((item) => item._id !== bookmark._id));
      if (editing?._id === bookmark._id) setEditing(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const hasFilters = tagFilter !== 'all' || favoritesOnly || search.trim() !== '';

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__content">
          <p className="hero__kicker">
            <span className="hero__seal" aria-hidden="true">
              B
            </span>
            <span>The Summer Edit</span>
            <span className="hero__kicker-sep" aria-hidden="true" />
            <span className="hero__kicker-year">2026</span>
          </p>

          <h1>
            A summer shelf for the <em>links worth keeping.</em>
          </h1>

          <p className="hero__lede">
            Save the articles, tools and little corners of the internet you want to come
            back to. Star the essentials, tag the rest, and let everything else go.
          </p>

          <div className="hero__stats" aria-label="Summary">
            <span>
              <strong>{visibleBookmarks.length}</strong>{' '}
              {hasFilters ? 'matching' : 'saved'}
            </span>
            <span className="hero__stats-dot" aria-hidden="true" />
            <span>
              <strong>{bookmarks.filter((bookmark) => bookmark.isFavorite).length}</strong>{' '}
              favorites
            </span>
          </div>
        </div>

        <SummerScene />
      </header>

      {error && (
        <div className="alert" role="alert">
          <span>{error}</span>
          <button type="button" className="link-button" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}

      <main className="layout">
        <aside className="sidebar">
          <BookmarkForm
            key={editing?._id ?? 'new'}
            editing={editing}
            saving={saving}
            onSubmit={handleSave}
            onCancelEdit={() => setEditing(null)}
          />
          <p className="hint">
            Tip: click a title to open the link in a new tab, or the star to favorite it.
          </p>
        </aside>

        <section className="content">
          <FilterBar
            tags={knownTags}
            activeTag={tagFilter}
            onTagChange={handleTagChange}
            search={search}
            onSearchChange={setSearch}
            favoritesOnly={favoritesOnly}
            onFavoritesOnlyChange={setFavoritesOnly}
          />

          <div className="list-heading">
            <h2>{tagFilter === 'all' ? 'All bookmarks' : `#${tagFilter}`}</h2>
            <span className="list-heading__meta">sorted newest first</span>
          </div>

          <BookmarkList
            bookmarks={visibleBookmarks}
            loading={loading}
            hasFilters={hasFilters}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            onEdit={setEditing}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
