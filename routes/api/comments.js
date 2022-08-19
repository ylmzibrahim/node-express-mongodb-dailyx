const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const authOptional = require('../../middleware/authOptional');
const User = require('../../models/User');
const Comment = require('../../models/Comment');

// @route   GET api/articles/{slug}/comments
// @desc    Get comments for an article
// @access  Public
router.get('/:slug/comments', authOptional, async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
    });
    if (!article) return res.status(404).json({ msg: 'Article not found' });

    const comments = await Comment.find({
      slug: req.params.slug,
    }).sort({ createdAt: -1 });
    res.json({ comments });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/articles/{slug}/comments
// @desc    Create a comment for an article
// @access  Public
router.post('/:slug/comments', auth, async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
    });
    if (!article) return res.status(404).json({ msg: 'Article not found' });

    const user = await User.findById(req.user.id).select('-password');
    const { body } = req.body.comment;

    const comment = new Comment({
      slug: req.params.slug,
      body,
      author: {
        username: user.username,
        bio: user.bio,
        image: user.image,
      },
    });

    await comment.save();
    res.json({ comment });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/articles/{slug}/comments
// @desc    Delete a comment for an article
// @access  Public
router.delete('/:slug/comments/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const article = await Article.findOne({
      slug: req.params.slug,
    });
    if (!article) return res.status(404).json({ msg: 'Article not found' });
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });
    if (comment.author.username !== user.username)
      return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Comment deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
