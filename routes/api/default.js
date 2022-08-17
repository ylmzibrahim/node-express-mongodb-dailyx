const express = require('express');
const router = express.Router();

// @route   GET api/default
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Default route'));

module.exports = router;