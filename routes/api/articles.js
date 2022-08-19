const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../../middleware/auth');
const authOptional = require('../../middleware/authOptional');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');
const Article = require('../../models/Article');

// @route   GET api/articles/feed
// @desc    Get recent articles from users you follow
// @access  Public
router.get('/feed', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).select(
      '-_id -password -__v'
    );
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;
    let followingUsernames = [currentUser.username];

    let promise = currentUser.following.map(async (id) => {
      const user = await User.findById(id).select('username');
      followingUsernames.push(user.username);
    });

    Promise.all(promise).then(async () => {
      const articles = await Article.find({
        'author.username': { $in: followingUsernames },
      })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      res.json({ articles });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/articles
// @desc    Get recent articles globally
// @access  Public
router.get('/', authOptional, async (req, res) => {
  try {
    const tag = req.query.tag || '';
    const author = req.query.author || '';
    const favorited = req.query.favorited || '';
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;

    let favoritedIds = [];
    let findQuery = {};

    // Check if user is logged in and if favorited is set to true
    if (favorited && req.user !== undefined) {
      const user = await User.findById(req.user.id).select(
        '-_id -password -__v'
      );
      user.favorited.forEach(async (id) => {
        favoritedIds.push(id);
      });
      findQuery = {
        tagList: tag || { $ne: null },
        'author.username': author || { $ne: null },
        _id: { $in: favoritedIds },
      };
    } else {
      findQuery = {
        tagList: tag || { $ne: null },
        'author.username': author || { $ne: null },
      };
    }
    const articles = await Article.find(findQuery)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    res.json({ articles });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/articles
// @desc    Create an article
// @access  Public
router.post('/', auth, async (req, res) => {
  const { title, description, body, tagList } = req.body.article;
  const user = await User.findById(req.user.id);

  try {
    let article = await Article.findOne({ title });
    if (article)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Article already exists' }] });

    const slug = title.toLowerCase().replace(/ /g, '-');

    article = new Article({
      slug,
      title,
      description,
      body,
      tagList,
      author: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: false,
      },
    });

    await article.save();
    res.json({ article: article });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/articles/{slug}
// @desc    Get an article
// @access  Public
router.get('/:slug', authOptional, async (req, res) => {
  try {
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/articles/{slug}
// @desc    Update an article
// @access  Public
router.put('/:slug', auth, async (req, res) => {
  try {
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/articles/{slug}
// @desc    Delete an article
// @access  Public
router.delete('/:slug', auth, async (req, res) => {
  try {
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
