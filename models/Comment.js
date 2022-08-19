const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
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
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    following: {
      type: Boolean,
      required: true,
    },
  },
});

module.exports = Comment = mongoose.model('Comment', commentSchema);
