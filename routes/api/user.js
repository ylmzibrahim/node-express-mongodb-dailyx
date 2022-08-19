const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// @route   GET api/user
// @desc    Get current user
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-_id -password -__v');
    res.json({ user: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/user
// @desc    Update current user
// @access  Public
router.put('/', auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    const { email, token, username, bio, image, password } = req.body.user;

    let controlUser = await User.findOne({ username });
    if (controlUser)
      if (controlUser.id !== user.id)
        return res
          .status(400)
          .json({ errors: [{ msg: 'Username already exists' }] });

    controlUser = await User.findOne({ email });
    if (controlUser)
      if (controlUser.id !== user.id)
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email already exists ' }] });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (email) user.email = email;
    if (token) user.token = token;
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (image) user.image = image;
    await user.save();

    res.json({
      user: {
        email,
        token,
        username,
        bio,
        image,
        password,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
