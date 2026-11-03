import Bookmark from '../models/Bookmark.js';
import asyncHandler from '../utils/asyncHandler.js';

const normalizeTag = (tag) => {
  const clean = typeof tag === 'string' ? tag.trim().toLowerCase() : '';
  return clean || 'general';
};

// POST /api/bookmarks
export const createBookmark = asyncHandler(async (req, res) => {
  const { title, url, tag, isFavorite } = req.body;

  const bookmark = await Bookmark.create({
    title,
    url,
    tag: normalizeTag(tag),
    isFavorite: Boolean(isFavorite),
  });

  res.status(201).json({ success: true, data: bookmark });
});

// GET /api/bookmarks?tag=react
export const getBookmarks = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.tag && req.query.tag.trim()) {
    filter.tag = req.query.tag.trim().toLowerCase();
  }

  const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1, _id: -1 });

  res.status(200).json({ success: true, count: bookmarks.length, data: bookmarks });
});

// PATCH /api/bookmarks/:id/favorite
export const toggleFavorite = asyncHandler(async (req, res) => {
  const bookmark = await Bookmark.findById(req.params.id);

  if (!bookmark) {
    return res.status(404).json({ success: false, error: 'Bookmark not found' });
  }

  bookmark.isFavorite = !bookmark.isFavorite;
  await bookmark.save();

  res.status(200).json({ success: true, data: bookmark });
});

// PUT /api/bookmarks/:id (bonus: edit)
export const updateBookmark = asyncHandler(async (req, res) => {
  const bookmark = await Bookmark.findById(req.params.id);

  if (!bookmark) {
    return res.status(404).json({ success: false, error: 'Bookmark not found' });
  }

  const { title, url, tag } = req.body;

  if (title !== undefined) bookmark.title = title;
  if (url !== undefined) bookmark.url = url;
  if (tag !== undefined) bookmark.tag = normalizeTag(tag);

  const updated = await bookmark.save();

  res.status(200).json({ success: true, data: updated });
});

// DELETE /api/bookmarks/:id
export const deleteBookmark = asyncHandler(async (req, res) => {
  const bookmark = await Bookmark.findByIdAndDelete(req.params.id);

  if (!bookmark) {
    return res.status(404).json({ success: false, error: 'Bookmark not found' });
  }

  res.status(200).json({
    success: true,
    data: { id: bookmark._id, title: bookmark.title },
  });
});
