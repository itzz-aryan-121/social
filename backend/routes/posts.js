import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import { checkBanStatus } from '../middleware/auth.js';

const router = express.Router();


// Create Post

router.post('/', checkBanStatus, async (req, res) => {
    try {
        const { title,
            content,
            isAnonymous,
            tags,
            category,
            triggerWarning,
            triggerWarningText,
            images,
            group,
            isSensitive } = req.body;

        const newPost = new Post({
            author: req.user.id,
            title,
            content,
            isAnonymous,
            tags,
            category,
            triggerWarning,
            triggerWarningText,
            images,
            group,
            isSensitive,
            status: 'pending'
        });

        const savedPost = await newPost.save();

        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
})

//Pagination of Posts

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;

        const posts = await Post.find({ status: 'published' })
            .sort({ createdAt: -1 })
            .skip(skipIndex)
            .limit(limit)
            .populate('author', 'username profilePicture isAnonymous')
            .populate('group', 'name isPrivate');

        const totalPosts = await Post.countDocuments({ status: 'published' });

        res.status(200).json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts
        });

    } catch (error) {
        res.status(500).json({ message: err.message });
    }
})

// Posts by Category Selection

router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;

        const posts = await Post.find({ status: 'published', category }).sort({ createdAt: -1 }).skip(skipIndex).limit(limit).populate('author', 'username profilePicture isAnonymous').populate('group', 'name isPrivate');

        const totalPosts = await Post.countDocuments({ status: 'published', category });

        res.status(200).json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts
        });

    } catch (error) {

    }
})

// Post Specific

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username profilePicture isAnonymous bio')
            .populate('group', 'name isPrivate confidentialityLevel');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }


        post.viewCount += 1;
        await post.save();

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Post

router.put('/:id', checkBanStatus, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }


        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        const {
            title,
            content,
            isAnonymous,
            tags,
            category,
            triggerWarning,
            triggerWarningText,
            images,
            isSensitive
        } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                isAnonymous,
                tags,
                category,
                triggerWarning,
                triggerWarningText,
                images,
                isSensitive,
                status: 'pending',
                updatedAt: Date.now()
            },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Post

router.delete('/:id', checkBanStatus, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }


        const user = await User.findById(req.user.id);

        if (post.author.toString() !== req.user.id && !['moderator', 'admin'].includes(user.role)) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }


        await Comment.deleteMany({ post: req.params.id });


        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Post and all associated comments deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Like Post & Unlike Post
router.delete('/:id', checkBanStatus, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }


        const user = await User.findById(req.user.id);

        if (post.author.toString() !== req.user.id && !['moderator', 'admin'].includes(user.role)) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }


        await Comment.deleteMany({ post: req.params.id });


        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Post and all associated comments deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

})

// Get Posts by User(Specific User)

router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;

        const posts = await Post.find({
            author: userId,
            status: 'published'
        })
            .sort({ createdAt: -1 })
            .skip(skipIndex)
            .limit(limit)
            .populate('author', 'username profilePicture isAnonymous')
            .populate('group', 'name isPrivate');

        const totalPosts = await Post.countDocuments({
            author: userId,
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

// Get Posts by Tags

router.get('/tags/:tag', async (req, res) => {
    try {
        const { tag } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;

        const posts = await Post.find({
            tags: tag,
            status: 'published'
        })
            .sort({ createdAt: -1 })
            .skip(skipIndex)
            .limit(limit)
            .populate('author', 'username profilePicture isAnonymous')
            .populate('group', 'name isPrivate');

        const totalPosts = await Post.countDocuments({
            tags: tag,
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

// Get Posts by User (all post including flagged and pending)
router.get('/my/posts', checkBanStatus, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;

        const posts = await Post.find({ author: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skipIndex)
            .limit(limit)
            .populate('author', 'username profilePicture isAnonymous')
            .populate('group', 'name isPrivate');

        const totalPosts = await Post.countDocuments({ author: req.user.id });

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