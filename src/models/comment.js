const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
