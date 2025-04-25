import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const  authenticateToken = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message: 'Access Denied'});
    }

    try {
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
}



// Middleware to check if user has required role
export const isAdmin = (allowedRoles = ['admin']) => (req, res, next) => {
    try {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


// Check if user is banned

export const checkBanStatus = async (req,res,next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
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
        next();
    } catch (error) {
        res.status(500).json({message: 'Internal Server Error'});
    }
}