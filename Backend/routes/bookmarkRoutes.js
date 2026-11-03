import { Router } from 'express';
import {
  createBookmark,
  deleteBookmark,
  getBookmarks,
  toggleFavorite,
  updateBookmark,
} from '../controllers/bookmarkController.js';

const router = Router();

router.route('/').get(getBookmarks).post(createBookmark);
router.patch('/:id/favorite', toggleFavorite);
router.route('/:id').put(updateBookmark).delete(deleteBookmark);

export default router;
