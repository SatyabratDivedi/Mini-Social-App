const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  post: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  liked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
});

const post = mongoose.model('post', postSchema);
module.exports = post;
