const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate'); // for autopopulating comments


const schema = new Schema(
  {
    body: {
      type: String,
      required: true
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        autopopulate: true,
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    timestamps: false
  }
);

schema.plugin(autopopulate);

schema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Comment', schema);