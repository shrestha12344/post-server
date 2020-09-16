const express = require('express');

const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');
const authMiddleware = require('../middleware/auth');

router.get('/all', async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort('-date')
      .populate('user', ['username', 'photo'])
      .exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/search/:query', async (req, res) => {
  try {
    const posts = await Post.find({
      content: { $regex: req.params.query, $options: 'i' },
    })
      .sort('-date')
      .populate('user', ['username', 'photo'])
      .exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/create', authMiddleware, async (req, res) => {
  const { user } = req.body.data;
  const { content } = req.body.data;
  const post = new Post({ user, content });
  try {
    const newPost = await post.save();
    res.json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/update/:_id', authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    await Post.findOneAndUpdate(
      { _id: req.params },
      { content },
      { useFindAndModify: false },
    ).exec();
    res.json({ update: true });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/delete/:_id', authMiddleware, async (req, res) => {
  try {
    const deletePost = await Post.deleteOne(req.params);
    // eslint-disable-next-line no-underscore-dangle
    const deleteComments = await Comment.deleteMany({ post: req.params._id });
    res.json({ deletePost, deleteComments });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
