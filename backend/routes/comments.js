import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { checkBanStatus } from '../middleware/auth.js';


const router = express.Router();


// Create Comment

router.post('/', checkBanStatus, async (req, res) => {
    try {
        const { postId, content, isAnonymous, parentCommentId } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                return res.status(404).json({ message: 'Parent comment not found' });
            }
        }

        const newComment = new Comment({
            author: req.user.id,
            post: postId,
            content,
            isAnonymous,
            parentComment: parentCommentId || null
        });

        const savedComment = await newComment.save();

        post.commentCount += 1;
        await post.save();

        await Comment.populate(savedComment, 'author', 'username profilePicture isAnonymous');

        res.status(201).json(savedComment);



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


// Get Comments by Post

router.get('/post/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const comments = await Comment.find({
            post: postId,
            parentComment: null,
            status: 'active'
        })
            .sort({ createdAt: -1 })
            .populate('author', 'username profilePicture isAnonymous');
        const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
            const replies = await Comment.find({
                parentComment: comment._id,
                status: 'active'
            })
                .sort({ createdAt: 1 })
                .populate('author', 'username profilePicture isAnonymous');

            return {
                ...comment.toObject(),
                replies
            };
        }));

        res.status(200).json(commentsWithReplies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


// Update Comment

router.put('/:id', checkBanStatus, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user.id && !['moderator', 'admin'].includes(user.role)) {
            return res.status(403).json({ message: 'Not authorized to update this comment' });
        }

        const { content, isAnonymous } = req.body;

        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                content,
                isAnonymous,
                updatedAt: Date.now()
            },
            { new: true }
        ).populate('author', 'username profilePicture isAnonymous');

        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

})


// Delete Comment

router.delete('/:id', checkBanStatus, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }


        const user = await User.findById(req.user.id);

        if (comment.author.toString() !== req.user.id && !['moderator', 'admin'].includes(user.role)) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        const post = await Post.findById(comment.post);


        await Comment.deleteMany({
            $or: [
                { _id: req.params.id },
                { parentComment: req.params.id }
            ]
        });


        if (post) {

            const deletedCount = await Comment.countDocuments({
                $or: [
                    { _id: req.params.id },
                    { parentComment: req.params.id }
                ]
            });

            post.commentCount = Math.max(0, post.commentCount - deletedCount);
            await post.save();
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Like/Unlike Comment
router.put('/:id/like', checkBanStatus, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }


        const isLiked = comment.likes.includes(req.user.id);

        if (isLiked) {
            comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
        } else {
            comment.likes.push(req.user.id);
        }

        await comment.save();

        res.status(200).json({
            likes: comment.likes.length,
            isLiked: !isLiked
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;