const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: false },
  photo: { type: String, required: false },
  information: { type: String, required: false },
});

module.exports = mongoose.model('User', userSchema);
