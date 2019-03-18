const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate'); // for autopopulating comments
const Post = require('./post');

const schema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: true,
    },
    path: {
      type: String,
      required: true
    }
  },
  {
    timestamps: false
  }
);

schema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Upload', schema);