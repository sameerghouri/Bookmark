import 'dotenv/config';
import mongoose from 'mongoose';
import Bookmark from './models/Bookmark.js';

const samples = [
  {
    title: 'React Docs',
    url: 'https://react.dev',
    tag: 'react',
    isFavorite: true,
  },
  {
    title: 'Express Guide',
    url: 'https://expressjs.com/en/guide/routing.html',
    tag: 'node',
  },
  {
    title: 'Mongoose Docs',
    url: 'https://mongoosejs.com/docs/',
    tag: 'node',
  },
  {
    title: 'MDN: Flexbox',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout',
    tag: 'css',
  },
  {
    title: 'Postman Learning Center',
    url: 'https://learning.postman.com/',
    tag: 'tools',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Bookmark.deleteMany({});
    const created = await Bookmark.insertMany(samples);
    console.log(`Seeded ${created.length} bookmarks.`);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
