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
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import userRoutes from "./routes/users.js";

// Add these lines near your other imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7001;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if unable to connect to database
});

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

//Routing Part

app.use("/api/auth", authRoutes);
app.use("/api/posts", authenticateToken, postRoutes);
app.use("/api/comments", authenticateToken, commentRoutes);
app.use("/api/groups", authenticateToken, groupRoutes);
app.use("/api/moderation", authenticateToken, moderationRoutes);
app.use("/api/users", authenticateToken, userRoutes);

//Server Static Production

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
//   });
// }
app.get("/", (req, res) => {
  res.send("API is running..."); // Simple message to check if the server is running
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
