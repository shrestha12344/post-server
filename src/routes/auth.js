const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const User = require('../models/auth');

const filterUser = (user) => _.pick(user, ['_id', 'email', 'username', 'photo', 'information']);

router.post('/signin', async (req, res) => {
  const { email } = req.body.data;
  const { password } = req.body.data;
  try {
    const user = await User.findOne({ email }).exec();
    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword) {
        res.json({
          user: filterUser(user),
          token: jwt.sign(email, '$$$'),
        });
      } else {
        res.status(401).json({ message: 'Email and password do not match' });
      }
    } else {
      res.status(400).json({ message: 'User does not exist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body.data;
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const userData = new User({ email, password: passwordHash });
      const newUser = await userData.save();
      res.json({
        user: filterUser(newUser),
        token: jwt.sign(email, '$$$'),
      });
    } else {
      res.status(400).json({ message: 'User already exists' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/googleauth', async (req, res) => {
  const { email, password } = req.body.data;
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const userData = new User({ ...req.body.data, password: passwordHash });
      const newUser = await userData.save();
      res.json({
        user: filterUser(newUser),
        token: jwt.sign(email, '$$$'),
      });
    } else {
      res.json({
        user: filterUser(user),
        token: jwt.sign(email, '$$$'),
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
