const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  bio: {
    type: String,
    default: null,
  },
  image: {
    type: String,
  },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  favorited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model('user', userSchema);
