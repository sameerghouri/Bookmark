import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Turn any API/network failure into a message the UI can show.
export const getErrorMessage = (error) =>
  error?.response?.data?.error || error?.message || 'Something went wrong';

export const fetchBookmarks = async (tag) => {
  const params = tag && tag !== 'all' ? { tag } : {};
  const { data } = await api.get('/bookmarks', { params });
  return data.data;
};

export const createBookmark = async (payload) => {
  const { data } = await api.post('/bookmarks', payload);
  return data.data;
};

export const toggleFavorite = async (id) => {
  const { data } = await api.patch(`/bookmarks/${id}/favorite`);
  return data.data;
};

export const updateBookmark = async (id, payload) => {
  const { data } = await api.put(`/bookmarks/${id}`, payload);
  return data.data;
};

export const deleteBookmark = async (id) => {
  await api.delete(`/bookmarks/${id}`);
};

export default api;
