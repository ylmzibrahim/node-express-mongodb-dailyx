const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
  tags: {
    type: Array,
    required: true,
  },
});

module.exports = Tags = mongoose.model('Tags', tagsSchema);
