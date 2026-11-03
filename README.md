# Bookmark Manager

A small full-stack MERN app for saving useful links. Create bookmarks, favorite them, filter by tag, search by title, edit, and delete — all backed by an Express + MongoDB API.

![Stack](https://img.shields.io/badge/stack-Express%20%7C%20MongoDB%20%7C%20React%20%7C%20Vite-6d4aff)

## Features

- **Create** bookmarks with title, URL, and tag (validated on both client and server)
- **List** bookmarks newest-first with clickable links (opens in a new tab) and tag badges
- **Filter** by tag using the API (`GET /api/bookmarks?tag=react`)
- **Favorite** toggle (optimistic UI) and **delete**
- **Search** by title and a **Favorites only** toggle (client-side)
- **Edit** an existing bookmark (bonus `PUT` route + prefilled form)
- **Summer VIP theme** with a CSS 3D flip card, orbit rings, palm silhouettes, and canvas sparkles (no extra 3D library)
- Loading skeletons, empty states, and error messages with retry
- Fully responsive, keyboard accessible, and respects `prefers-reduced-motion`

## Folder structure

```
Bookmark/
├── Backend/
│   ├── config/db.js
│   ├── controllers/bookmarkController.js
│   ├── middleware/errorHandler.js
│   ├── models/Bookmark.js
│   ├── routes/bookmarkRoutes.js
│   ├── utils/asyncHandler.js
│   ├── app.js
│   ├── server.js
│   ├── seed.js
│   ├── .env.example
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookmarkForm.jsx
│   │   │   ├── BookmarkItem.jsx
│   │   │   ├── BookmarkList.jsx
│   │   │   └── FilterBar.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── postman/
│   └── Bookmark Manager API.postman_collection.json
└── README.md
```

## Running the project

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)
- Postman (optional, for testing the API)

### 1. Backend

```bash
cd Backend
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

`.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bookmark-app
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Using MongoDB Atlas instead? Replace the URI (keep the database name before the `?`):

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bookmark-app?retryWrites=true&w=majority
```

Make sure your current IP is allowed in Atlas under **Network Access**.

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. You should see:

```
MongoDB connected: 127.0.0.1/bookmark-app
API running on http://localhost:5000
```

Optional — load five sample bookmarks:

```bash
npm run seed
```

### 2. Frontend

In a second terminal:

```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to `http://localhost:5000`, so no extra configuration is needed in development.

To point the frontend at a different API, create `Frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000/api
```

## API reference

Base URL: `http://localhost:5000/api`

All responses use a consistent shape:

```json
{ "success": true, "data": {} }
{ "success": false, "error": "Message" }
```

| Method  | Route                        | Description                                  | Success |
| ------- | ---------------------------- | -------------------------------------------- | ------- |
| `GET`   | `/health`                    | Health check                                 | `200`   |
| `POST`  | `/bookmarks`                 | Create a bookmark                            | `201`   |
| `GET`   | `/bookmarks`                 | List all, newest first (`?tag=react` filter) | `200`   |
| `PATCH` | `/bookmarks/:id/favorite`    | Toggle `isFavorite`                          | `200`   |
| `PUT`   | `/bookmarks/:id`             | Update title, URL, or tag (bonus)            | `200`   |
| `DELETE`| `/bookmarks/:id`             | Delete a bookmark                            | `200`   |

Validation errors return `400`; unknown ids or routes return `404`.

### Example requests

```bash
# Create
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"title":"React Docs","url":"https://react.dev","tag":"react"}'

# Filter by tag
curl "http://localhost:5000/api/bookmarks?tag=react"

# Toggle favorite
curl -X PATCH http://localhost:5000/api/bookmarks/<id>/favorite

# Delete
curl -X DELETE http://localhost:5000/api/bookmarks/<id>
```

### Testing in Postman

Import `postman/Bookmark Manager API.postman_collection.json`. The collection has requests with assertions for every route, including the `400` and `404` cases. Run **Create bookmark** first — it stores the new id in the `bookmarkId` collection variable used by the favorite, update, and delete requests.

## Notes / design decisions

- The model validates that URLs start with `http://` or `https://`, trims `title`, lowercases `tag`, and defaults the tag to `general`.
- `timestamps: true` provides `createdAt`/`updatedAt`; list results sort by `createdAt` descending (with `_id` as a tiebreaker).
- Tags are normalized to lowercase so `?tag=React` and `?tag=react` behave the same.
- Errors funnel through one middleware, so every failure uses `{ success: false, error }`.
- The frontend keeps all API calls in `src/services/api.js`; search and the favorites-only toggle filter the already-loaded list, while tag changes re-query the API.
