const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    title: {
      type: String,
    },
    body: {
      type: String
    },
    url: {
      type: String
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    commentCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      required: true,
      default: 'published'
    },
  },
  {
    timestamps: true
  }
);

schema.statics = {
  incCommentCount(postId) {
    return this.findByIdAndUpdate(
      postId,
      {$inc: {commentCount: 1} },
      {new: true}
    );
  }
};

schema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Post', schema);