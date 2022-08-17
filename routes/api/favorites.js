const express = require('express');
const router = express.Router();

// @route   GET api/favorites
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Favorite route'));

module.exports = router;