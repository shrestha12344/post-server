const express = require('express');

const router = express.Router();
const _ = require('lodash');
const authMiddleware = require('../middleware/auth');
const User = require('../models/auth');

const filterUser = (user) => _.pick(user, ['_id', 'email', 'username', 'photo', 'information']);

router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.data }).exec();
    res.json({ user: filterUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/update/:_id', authMiddleware, async (req, res) => {
  let user;
  const { username } = req.body;
  const { information } = req.body;
  try {
    if (req.files !== null) {
      const { photo } = req.files;
      await photo.mv(`${__dirname}/uploads/${photo.name}`);
      const filePath = `http://localhost:9000/uploads/${photo.name}`;
      user = await User.findOneAndUpdate(
        req.params,
        {
          username,
          information,
          photo: filePath,
        },
        { new: true, useFindAndModify: false },
      ).exec();
    }
    user = await User.findOneAndUpdate(
      req.params,
      {
        username,
        information,
      },
      { new: true, useFindAndModify: false },
    ).exec();
    res.json({ user: filterUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
