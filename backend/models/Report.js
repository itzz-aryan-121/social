import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      targetType: {
        type: String,
        enum: ['post', 'comment', 'user', 'group'],
        required: true
      },
      targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      reason: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'resolved', 'dismissed'],
        default: 'pending'
      },
      moderatorNotes: {
        type: String,
        default: ''
      },
      moderatorAction: {
        type: String,
        enum: ['none', 'warning', 'content_removal', 'temporary_ban', 'permanent_ban'],
        default: 'none'
      },
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
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

const Report = mongoose.model('Report',reportSchema);

export default Report;