import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
      },
      content: {
        type: String,
        required: true
      },
      isAnonymous: {
        type: Boolean,
        default: false
      },
      likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
      },
      status: {
        type: String,
        enum: ['active', 'flagged', 'removed'],
        default: 'active'
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
})

const Comment = mongoose.model('Comment',commentSchema);

export default Comment;