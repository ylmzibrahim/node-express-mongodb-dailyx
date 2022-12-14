const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route   POST api/users/login
// @desc    Existing user login
// @access  Public
router.post(
  '/login',
  [
    check('user.email', 'Please include a valid email').isEmail(),
    check('user.password', 'Password is required').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body.user;

      let user = await User.findOne({ email });

      if (!user)
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        async (err, token) => {
          if (err) throw err;
          await user.updateOne({ token });
          const userInfo = await User.findById(user.id).select(
            '-_id -password -__v'
          );
          res.json({ user: userInfo });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/users
// @desc    Register a new user
// @access  Public
router.post(
  '/',
  [
    check('user.username', 'Username is required').not().isEmpty(),
    check('user.email', 'Please include a valid email').isEmail(),
    check(
      'user.password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body.user;

      if (await User.findOne({ username, email }))
        return res
          .status(400)
          .json({ errors: [{ msg: 'Username and email already exists' }] });
      else if (await User.findOne({ username }))
        return res
          .status(400)
          .json({ errors: [{ msg: 'Username already exists' }] });
      else if (await User.findOne({ email }))
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email already exists' }] });

      const image = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      let user = new User({
        username,
        email,
        password,
        image,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        async (err, token) => {
          if (err) throw err;
          user.token = token;
          await user.save();
          const userInfo = await User.findById(user.id).select(
            '-_id -password -__v'
          );
          res.json({ user: userInfo });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
