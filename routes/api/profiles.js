const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const authOptional = require('../../middleware/authOptional');
const User = require('../../models/User');

// @route   GET api/profiles/{username}
// @desc    Get profile by username
// @access  Public
router.get('/:username', authOptional, async (req, res) => {
  try {
    let following = false;

    // Check if user is logged in
    if (req.user !== undefined) {
      const userRequestor = await User.findOne({ id: req.user.id });
      const userParam = await User.findOne({ username: req.params.username });
      // Check if user is following the user
      if (userRequestor.following.includes(userParam.id)) following = true;
    }

    const { username, bio, image } = await User.findOne({
      username: req.params.username,
    });

    res.json({ profile: { username, bio, image, following } });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profiles/{username}/follow
// @desc    Follow a user
// @access  Public
router.post('/:username/follow', auth, async (req, res) => {
  try {
    const userRequestor = await User.findOne({ id: req.user.id });
    const userParam = await User.findOne({ username: req.params.username });

    if (!userRequestor.following.includes(userParam.id)) {
      // Add user.id to following array
      userRequestor.following.push(userParam.id);
      await userRequestor.save();
    }

    const { username, bio, image } = await User.findOne({
      username: req.params.username,
    });

    res.json({ profile: { username, bio, image, following: true } });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profiles/{username}/follow
// @desc    Unfollow a user
// @access  Public
router.delete('/:username/follow', auth, async (req, res) => {
  try {
    const userRequestor = await User.findOne({ id: req.user.id });
    const userParam = await User.findOne({ username: req.params.username });

    if (userRequestor.following.includes(userParam.id)) {
      // Remove user.id from following array
      const index = userRequestor.following.indexOf(userParam.id);
      if (index > -1) userRequestor.following.splice(index, 1);
      await userRequestor.save();
    }

    const { username, bio, image } = await User.findOne({
      username: req.params.username,
    });

    res.json({ profile: { username, bio, image, following: false } });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
