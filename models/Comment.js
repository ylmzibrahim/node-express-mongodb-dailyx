const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  slug: {
    type: String,
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
  body: {
    type: String,
    required: true,
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
      required: true,
    },
    following: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports = Comment = mongoose.model('Comment', commentSchema);
