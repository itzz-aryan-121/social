import express from 'express';
import Post from '../models/Post.js';
import Group from '../models/Group.js';
import User from '../models/User.js';
import Report from '../models/Report.js';
import Comment from '../models/Comment.js';
import { isAdmin } from '../middleware/auth.js';


const router = express.Router();



router.post('/report', async (req, res) => {
    try {
      const { targetType, targetId, reason, description } = req.body;
      
      // Validate target exists based on type
      let targetExists = false;
      
      if (targetType === 'post') {
        targetExists = await Post.exists({ _id: targetId });
      } else if (targetType === 'comment') {
        targetExists = await Comment.exists({ _id: targetId });
      } else if (targetType === 'user') {
        targetExists = await User.exists({ _id: targetId });
      } else if (targetType === 'group') {
        targetExists = await Group.exists({ _id: targetId });
      }
      
      if (!targetExists) {
        return res.status(404).json({ message: `${targetType} not found` });
      }
      
      // Check if user is reporting themselves
      if (targetType === 'user' && targetId === req.user.id) {
        return res.status(400).json({ message: 'You cannot report yourself' });
      }
      
      // Create report
      const newReport = new Report({
        reporter: req.user.id,
        targetType,
        targetId,
        reason,
        description
      });
      
      const savedReport = await newReport.save();
      
      // Update the reported count on target if user
      if (targetType === 'user') {
        await User.findByIdAndUpdate(
          targetId,
          { $inc: { reportedCount: 1 } }
        );
      }
      
      res.status(201).json({ 
        message: 'Report submitted successfully. Our moderators will review it.',
        reportId: savedReport._id
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get all pending reports (moderators only)
  router.get('/reports', isAdmin(['moderator', 'admin']), async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skipIndex = (page - 1) * limit;
      const status = req.query.status || 'pending';
      
      const reports = await Report.find({ status })
        .sort({ createdAt: -1 })
        .skip(skipIndex)
        .limit(limit)
        .populate('reporter', 'username')
        .populate('resolvedBy', 'username');
      
      const totalReports = await Report.countDocuments({ status });
      
      // Populate target details for each report
      const populatedReports = await Promise.all(reports.map(async (report) => {
        const reportObj = report.toObject();
        
        if (report.targetType === 'post') {
          reportObj.targetDetails = await Post.findById(report.targetId)
            .select('title content author')
            .populate('author', 'username');
        } else if (report.targetType === 'comment') {
          reportObj.targetDetails = await Comment.findById(report.targetId)
            .select('content author post')
            .populate('author', 'username')
            .populate('post', 'title');
        } else if (report.targetType === 'user') {
          reportObj.targetDetails = await User.findById(report.targetId)
            .select('username email reportedCount warningCount');
        } else if (report.targetType === 'group') {
          reportObj.targetDetails = await Group.findById(report.targetId)
            .select('name description creator')
            .populate('creator', 'username');
        }
        
        return reportObj;
      }));
      
      res.status(200).json({
        reports: populatedReports,
        currentPage: page,
        totalPages: Math.ceil(totalReports / limit),
        totalReports
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Approve/Reject a pending post (moderators only)
  router.put('/posts/:id', isAdmin(['moderator', 'admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const { action, moderatorNotes } = req.body;
      
      const post = await Post.findById(id);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      if (post.status !== 'pending') {
        return res.status(400).json({ message: `Post is already ${post.status}` });
      }
      
      if (action === 'approve') {
        post.status = 'published';
      } else if (action === 'reject') {
        post.status = 'removed';
      } else {
        return res.status(400).json({ message: 'Invalid action. Use "approve" or "reject"' });
      }
      
      // Add moderator notes if provided
      if (moderatorNotes) {
        post.moderatorNotes = moderatorNotes;
      }
      
      await post.save();
      
      res.status(200).json({ 
        message: `Post ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        status: post.status
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Process a report (moderators only)
  router.put('/reports/:id', isAdmin(['moderator', 'admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const { status, moderatorNotes, moderatorAction } = req.body;
      
      const report = await Report.findById(id);
      
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      
      if (report.status !== 'pending') {
        return res.status(400).json({ message: `Report is already ${report.status}` });
      }
      
      // Update report status
      report.status = status;
      report.moderatorNotes = moderatorNotes || '';
      report.moderatorAction = moderatorAction || 'none';
      report.resolvedBy = req.user.id;
      report.updatedAt = Date.now();
      
      await report.save();
      
      // If action needs to be taken on the target
      if (moderatorAction !== 'none') {
        if (report.targetType === 'post' && ['content_removal'].includes(moderatorAction)) {
          // Remove the post
          await Post.findByIdAndUpdate(
            report.targetId,
            { status: 'removed' }
          );
        } else if (report.targetType === 'comment' && ['content_removal'].includes(moderatorAction)) {
          // Remove the comment
          await Comment.findByIdAndUpdate(
            report.targetId,
            { status: 'removed' }
          );
        } else if (report.targetType === 'user') {
          const user = await User.findById(report.targetId);
          
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          
          if (moderatorAction === 'warning') {
            // Increment warning count
            user.warningCount += 1;
            await user.save();
          } else if (moderatorAction === 'temporary_ban') {
            // Ban for 7 days
            const banUntil = new Date();
            banUntil.setDate(banUntil.getDate() + 7);
            user.bannedUntil = banUntil;
            await user.save();
          } else if (moderatorAction === 'permanent_ban') {
            // Permanent ban
            user.isActive = false;
            await user.save();
          }
        }
      }
      
      res.status(200).json({ 
        message: `Report marked as ${status}`,
        action: moderatorAction
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get pending posts for moderation
  router.get('/pending-posts', isAdmin(['moderator', 'admin']), async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skipIndex = (page - 1) * limit;
      
      const posts = await Post.find({ status: 'pending' })
        .sort({ createdAt: -1 })
        .skip(skipIndex)
        .limit(limit)
        .populate('author', 'username profilePicture')
        .populate('group', 'name');
      
      const totalPosts = await Post.countDocuments({ status: 'pending' });
      
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
  

export default router;