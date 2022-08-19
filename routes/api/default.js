const express = require('express');
const router = express.Router();
const Article = require('../../models/Article');

// @route   GET api/
// @desc    Test route
// @access  Public
router.get('/tags', async (req, res) => {
  try {
    let tags = await Article.distinct('tagList');
    res.json({ tags });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
