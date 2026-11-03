import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      validate: {
        validator: (value) => /^https?:\/\/\S+$/i.test(value),
        message: 'URL must start with http:// or https://',
      },
    },
    tag: {
      type: String,
      trim: true,
      lowercase: true,
      default: 'general',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
