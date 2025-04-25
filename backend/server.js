import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import groupRoutes from "./routes/groups.js";
import moderationRoutes from "./routes/moderation.js";
import { authenticateToken } from "./middleware/auth.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 7001;

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI).then((
    console.log("Connected to MongoDB")
)).catch((err) => {
    console.log("MongoDB connection failed",err);
})

//Routing Part

app.use('/api/auth',authRoutes);
app.use('/api/posts', authenticateToken, postRoutes);
app.use('/api/comments', authenticateToken, commentRoutes);
app.use('/api/groups', authenticateToken, groupRoutes);
app.use('/api/moderation', authenticateToken, moderationRoutes);


//Server Static Production 

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
    });
  }

app.listen(PORT,()=>{
 console.log(`Server is running on port ${PORT}`)

})