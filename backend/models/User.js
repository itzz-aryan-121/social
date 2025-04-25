import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    bannedUntil: {
      type: Date,
      default: null
    },
    warningCount: {
      type: Number,
      default: 0
    },
    reportedCount: {
      type: Number,
      default: 0
    },
    groups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    }],
    followedTopics: [{
      type: String
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  });


// Hashing Password
userSchema.pre('save',async function(next){
    if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
})

// Validity Password
userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User',userSchema);

export default User;