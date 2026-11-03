import cors from 'cors';
import express from 'express';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// Allow the Vite dev server (and any configured origin) to call the API.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') ?? '*',
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } });
});

app.use('/api/bookmarks', bookmarkRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
