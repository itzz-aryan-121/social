import express from 'express';
import Group from '../models/Group.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import {checkBanStatus} from '../middleware/auth.js';



const router = express.Router();
// Create a group
router.post('/', checkBanStatus, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      isPrivate, 
      confidentialityLevel, 
      rules, 
      category, 
      topics 
    } = req.body;
    
    // Check if group name already exists
    const groupExists = await Group.findOne({ name });
    if (groupExists) {
      return res.status(400).json({ message: 'Group name already exists' });
    }
    
    const newGroup = new Group({
      name,
      description,
      creator: req.user.id,
      moderators: [req.user.id],
      members: [req.user.id],
      isPrivate,
      confidentialityLevel,
      rules,
      category,
      topics
    });
    
    const savedGroup = await newGroup.save();
    
    // Add group to user's groups
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { groups: savedGroup._id } }
    );
    
    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all public groups
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;
    
    const groups = await Group.find({ isPrivate: false })
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(limit)
      .populate('creator', 'username profilePicture')
      .populate('moderators', 'username profilePicture')
      .select('-members');
    
    const totalGroups = await Group.countDocuments({ isPrivate: false });
    
    res.status(200).json({
      groups,
      currentPage: page,
      totalPages: Math.ceil(totalGroups / limit),
      totalGroups
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific group
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'username profilePicture')
      .populate('moderators', 'username profilePicture');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // If group is private, check if user is a member
    if (group.isPrivate) {
      // If no user is authenticated or user is not a member
      if (!req.user || !group.members.includes(req.user.id)) {
        return res.status(403).json({ 
          message: 'This is a private group. Join to see its content.',
          isPrivate: true,
          name: group.name,
          description: group.description,
          category: group.category,
          membersCount: group.members.length
        });
      }
    }
    
    // Get member count instead of full member list for privacy
    const membersCount = group.members.length;
    
    // Check if requesting user is a member
    const isMember = req.user ? group.members.includes(req.user.id) : false;
    
    // Check if requesting user is a moderator
    const isModerator = req.user ? group.moderators.includes(req.user.id) : false;
    
    // Check if requesting user is the creator
    const isCreator = req.user ? group.creator.toString() === req.user.id : false;
    
    // Convert to object to manipulate
    const groupObj = group.toObject();
    
    // Remove full members list for privacy
    delete groupObj.members;
    
    res.status(200).json({
      ...groupObj,
      membersCount,
      isMember,
      isModerator,
      isCreator
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a group
router.put('/:id', checkBanStatus, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is a moderator of the group
    if (!group.moderators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this group' });
    }
    
    const { 
      name, 
      description, 
      isPrivate, 
      confidentialityLevel, 
      rules, 
      category, 
      topics 
    } = req.body;
    
    // Check if new group name already exists (if name is being changed)
    if (name && name !== group.name) {
      const groupExists = await Group.findOne({ name });
      if (groupExists) {
        return res.status(400).json({ message: 'Group name already exists' });
      }
    }
    
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      {
        name: name || group.name,
        description: description || group.description,
        isPrivate: isPrivate !== undefined ? isPrivate : group.isPrivate,
        confidentialityLevel: confidentialityLevel || group.confidentialityLevel,
        rules: rules || group.rules,
        category: category || group.category,
        topics: topics || group.topics,
        updatedAt: Date.now()
      },
      { new: true }
    )
      .populate('creator', 'username profilePicture')
      .populate('moderators', 'username profilePicture');
    
    // Get member count
    const membersCount = updatedGroup.members.length;
    
    // Convert to object to manipulate
    const groupObj = updatedGroup.toObject();
    
    // Remove full members list for privacy
    delete groupObj.members;
    
    res.status(200).json({
      ...groupObj,
      membersCount,
      isMember: true,
      isModerator: true
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Join a group
router.post('/:id/join', checkBanStatus, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is already a member
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }
    
    // Add user to group members
    group.members.push(req.user.id);
    await group.save();
    
    // Add group to user's groups
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { groups: group._id } }
    );
    
    res.status(200).json({ message: 'Successfully joined the group' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Leave a group
router.post('/:id/leave', checkBanStatus, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is a member
    if (!group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are not a member of this group' });
    }
    
    // Check if user is the creator
    if (group.creator.toString() === req.user.id) {
      return res.status(400).json({ 
        message: 'You are the creator of this group. You must transfer ownership before leaving.' 
      });
    }
    
    // Remove user from group members
    group.members = group.members.filter(id => id.toString() !== req.user.id);
    
    // If user is a moderator, remove from moderators as well
    if (group.moderators.includes(req.user.id)) {
      group.moderators = group.moderators.filter(id => id.toString() !== req.user.id);
    }
    
    await group.save();
    
    // Remove group from user's groups
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { groups: group._id } }
    );
    
    res.status(200).json({ message: 'Successfully left the group' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a moderator
router.post('/:id/moderators', checkBanStatus, async (req, res) => {
  try {
    const { userId } = req.body;
    
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is the creator or already a moderator
    if (group.creator.toString() !== req.user.id && !group.moderators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to add moderators' });
    }
    
    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if target user is a member
    if (!group.members.includes(userId)) {
      return res.status(400).json({ message: 'User must be a member of the group first' });
    }
    
    // Check if target user is already a moderator
    if (group.moderators.includes(userId)) {
      return res.status(400).json({ message: 'User is already a moderator' });
    }
    
    // Add target user to moderators
    group.moderators.push(userId);
    await group.save();
    
    res.status(200).json({ message: 'Successfully added user as moderator' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a moderator
router.delete('/:id/moderators/:userId', checkBanStatus, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is the creator
    if (group.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the group creator can remove moderators' });
    }
    
    // Check if target user is a moderator
    if (!group.moderators.includes(userId)) {
      return res.status(400).json({ message: 'User is not a moderator' });
    }
    
    // Check if trying to remove creator (which shouldn't be possible)
    if (group.creator.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove the creator as moderator' });
    }
    
    // Remove target user from moderators
    group.moderators = group.moderators.filter(id => id.toString() !== userId);
    await group.save();
    
    res.status(200).json({ message: 'Successfully removed user as moderator' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get posts from a specific group
router.get('/:id/posts', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // If group is private, check if user is a member
    if (group.isPrivate) {
      // If no user is authenticated or user is not a member
      if (!req.user || !group.members.includes(req.user.id)) {
        return res.status(403).json({ message: 'This is a private group. Join to see its content.' });
      }
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;
    
    const posts = await Post.find({ 
      group: req.params.id,
      status: 'published'
    })
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(limit)
      .populate('author', 'username profilePicture isAnonymous');
    
    const totalPosts = await Post.countDocuments({ 
      group: req.params.id,
      status: 'published'
    });
    
    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a group
router.delete('/:id', checkBanStatus, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is the creator
    if (group.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the group creator can delete the group' });
    }
    
    // Update all posts in the group to no longer be associated with it
    await Post.updateMany(
      { group: req.params.id },
      { $set: { group: null } }
    );
    
    // Remove group from all users' groups array
    await User.updateMany(
      { groups: req.params.id },
      { $pull: { groups: req.params.id } }
    );
    
    // Delete the group
    await Group.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Transfer ownership
router.post('/:id/transfer-ownership', checkBanStatus, async (req, res) => {
  try {
    const { newOwnerId } = req.body;
    
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is the creator
    if (group.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the group creator can transfer ownership' });
    }
    
    // Check if new owner exists
    const newOwner = await User.findById(newOwnerId);
    if (!newOwner) {
      return res.status(404).json({ message: 'New owner not found' });
    }
    
    // Check if new owner is a member
    if (!group.members.includes(newOwnerId)) {
      return res.status(400).json({ message: 'New owner must be a member of the group' });
    }
    
    // Update creator
    group.creator = newOwnerId;
    
    // Add new owner to moderators if not already
    if (!group.moderators.includes(newOwnerId)) {
      group.moderators.push(newOwnerId);
    }
    
    await group.save();
    
    res.status(200).json({ message: 'Group ownership transferred successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;