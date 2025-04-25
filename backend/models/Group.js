import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      description: {
        type: String,
        required: true
      },
      creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      moderators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      isPrivate: {
        type: Boolean,
        default: false
      },
      confidentialityLevel: {
        type: Number,
        enum: [1, 2, 3], // 1=Public, 2=Members-only, 3=Strictly confidential
        default: 1
      },
      rules: [{
        type: String
      }],
      category: {
        type: String,
        required: true
      },
      topics: [{
        type: String
      }],
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
})

const Group = mongoose.model('Group',groupSchema);

export default Group;