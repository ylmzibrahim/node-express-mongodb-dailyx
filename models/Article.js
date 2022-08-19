const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  tagList: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  favorited: {
    type: Boolean,
    default: false,
  },
  favoritesCount: {
    type: Number,
    default: 0,
  },
  author: {
    username: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: null,
    },
    image: {
      type: String,
    },
    following: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports = Article = mongoose.model('Article', articleSchema);
