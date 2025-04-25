import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      title: {
        type: String,
        required: true,
        trim: true
      },
      content: {
        type: String,
        required: true
      },
      isAnonymous: {
        type: Boolean,
        default: false
      },
      tags: [{
        type: String,
        trim: true
      }],
      category: {
        type: String,
        required: true
      },
      triggerWarning: {
        type: Boolean,
        default: false
      },
      triggerWarningText: {
        type: String,
        default: ''
      },
      images: [{
        type: String
      }],
      likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      commentCount: {
        type: Number,
        default: 0
      },
      viewCount: {
        type: Number,
        default: 0
      },
      status: {
        type: String,
        enum: ['pending', 'published', 'flagged', 'removed'],
        default: 'pending'
      },
      group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        default: null
      },
      isSensitive: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    
});

const Post = mongoose.model('Post',postSchema);

export default Post;
