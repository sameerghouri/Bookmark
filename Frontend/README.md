# Bookmark Manager — Frontend

React + Vite single-page app for the Bookmark Manager.

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`. API calls live in `src/services/api.js` and use `/api`, which Vite proxies to `http://localhost:5000` (see `vite.config.js`).

Set `VITE_API_URL` in a `.env` file to point at a different API, for example:

```env
VITE_API_URL=http://localhost:5000/api
```

See the [root README](../README.md) for full setup instructions and the API reference.
