import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';





const router = express.Router();


// Register User

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Please provide all required fields: username, email, and password' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long' 
            });
        }

        // Check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Check if username already exists
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
            role: 'user'
        });

        const savedUser = await user.save();

        // Generate token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


// Login User

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Your account has been permanently banned.' });
        }

        if (user.bannedUntil && user.bannedUntil > new Date()) {
            return res.status(403).json({
                message: `Your account is temporarily banned until ${user.bannedUntil.toLocaleDateString()}`,
                bannedUntil: user.bannedUntil
            });
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Get User

router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// User Profile Update

router.put('/profile', authenticateToken,async(req,res)=>{
    try {
        const {username,bio,profilePicture,isAnonymous} = req.body;

        if (username) {
            const usernameExists = await User.findOne({ 
              username, 
              _id: { $ne: req.user.id } 
            });
            
            if (usernameExists) {
              return res.status(400).json({ message: 'Username already exists' });
            }
          }
          
          const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { 
              username, 
              bio, 
              profilePicture, 
              isAnonymous 
            },
            { new: true }
          ).select('-password');
          
          res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


// Change Password
router.put('/change-password', authenticateToken, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
    
      const isMatch = await user.isValidPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
     
      user.password = newPassword;
      await user.save();
      
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
})


// Logout User

router.post('/logout',authenticateToken,async(req,res)=>{
    try {
        res.clearCookie('token');
        res.status(200).json({message: 'Logged out successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// Register Admin (only accessible by existing admins)
router.post('/register-admin', authenticateToken, isAdmin(['admin']), async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Check if username already exists
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new admin user
        const user = new User({
            username,
            email,
            password,
            role: 'admin' // Set role as admin
        });

        const savedUser = await user.save();

        // Generate token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;