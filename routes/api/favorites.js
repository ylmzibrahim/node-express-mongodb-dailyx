const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Article = require('../../models/Article');

// @route   POST api/articles/{slug}/favorite
// @desc    Favorite an article
// @access  Public
router.post('/:slug/favorite', auth, async (req, res) => {
  try {
    let following = false;

    const userRequestor = await User.findOne({ id: req.user.id });
    let article = await Article.findOne({ slug: req.params.slug });
    const author = await User.findOne({
      username: article.author.username,
    });

    // Check if user is following the article author
    if (userRequestor.following.includes(author.id)) following = true;

    if (!userRequestor.favorited.includes(article.id)) {
      // Add article.id to favorited array
      userRequestor.favorited.push(article.id);
      await userRequestor.save();
      // Increment article favorites count
      article.favoritesCount++;
      await article.save();
    }

    res.json({
      article: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: true,
        favoritesCount: article.favoritesCount,
        author: {
          username: author.username,
          bio: author.bio,
          image: author.image,
          following,
        },
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/articles/{slug}/favorite
// @desc    Unfavorite an article
// @access  Public
router.delete('/:slug/favorite', auth, async (req, res) => {
  try {
    let following = false;

    const userRequestor = await User.findOne({ id: req.user.id });
    const article = await Article.findOne({ slug: req.params.slug });
    const author = await User.findOne({
      username: article.author.username,
    });

    // Check if user is following the article author
    if (userRequestor.following.includes(author.id)) following = true;

    if (userRequestor.favorited.includes(article.id)) {
      // Remove article.id from favorited array
      const index = userRequestor.favorited.indexOf(article.id);
      if (index > -1) userRequestor.favorited.splice(index, 1);
      await userRequestor.save();
      // Increment article favorites count
      article.favoritesCount--;
      await article.save();
    }

    res.json({
      article: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: false,
        favoritesCount: article.favoritesCount,
        author: {
          username: author.username,
          bio: author.bio,
          image: author.image,
          following,
        },
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
