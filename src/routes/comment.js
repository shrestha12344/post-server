const express = require('express');

const router = express.Router();
const Comment = require('../models/comment');
const authMiddleware = require('../middleware/auth');

router.get('/all', async (req, res) => {
  try {
    const comments = await Comment.find({})
      .sort('date')
      .populate('user', ['username', 'photo'])
      .exec();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/create', authMiddleware, async (req, res) => {
  const comment = new Comment(req.body);
  try {
    const newComment = await comment.save();
    res.json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
