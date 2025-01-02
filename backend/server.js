import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import Message from "./models/messageModel.js";
import Chat from "./models/chatModel.js";

import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import cookieParser from "cookie-parser";
// Import routes
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// Import middleware
import { protect } from "./middlewares/authMiddleware.js";
import User from "./models/userModel.js";
import jwt from "jsonwebtoken";
// Configure environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://message-verse.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/", (req, res) => {
  res.send("Hello World !");
});
app.use("/api/auth", authRoutes);
app.use("/api/chats", protect, chatRoutes); // Protect chat routes with authentication middleware
app.use("/api/users", protect, userRoutes); // Protect user routes with authentication middleware
// Create HTTP server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
io.use((socket, next) => {
  const token = socket.handshake.headers.cookie.split("=")[1];

  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    next();
  });
});
io.on("connection", (socket) => {
  socket.on("join_chat", (chatId) => {
    if (!socket.user._id) {
      return socket.emit("unauthenticated", "Please authenticate first");
    }
    socket.join(chatId); // Adds the user to the room identified by chatId
    console.log(`User ${socket.user._id} joined chat: ${chatId}`);
  });

  // Handle sending messages
  socket.on("send_message", async (data) => {
    try {
      if (!socket.user._id) {
        return socket.emit("unauthenticated", "Please authenticate first");
      }

      const { content, chatId } = data;
      const senderId = socket.user._id; // Use userId from socket object

      // Create a new message in the database
      const message = await Message.create({
        sender: senderId,
        content,
        chat: chatId,
      });

      // Update the chat's latest message
      await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });
      const messageWithSender = {
        ...message.toObject(),
        sender: { _id: senderId.toString() },
      };
      // Emit the message to all users in the chat room (except the sender)
      socket.broadcast.to(chatId).emit("receive_message", messageWithSender);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Handle typing indicator
  socket.on("typing", (chatId) => {
    if (!socket.user?._id || !chatId) return; // Ensure user and chatId exist
    socket.broadcast.to(chatId).emit("typing", socket.user._id.toString()); // Send userId
  });

  // Handle stop typing indicator
  socket.on("stop_typing", (chatId) => {
    if (!socket.user?._id || !chatId) return; // Ensure user and chatId exist
    socket.broadcast.to(chatId).emit("stop_typing", socket.user._id.toString()); // Send userId
  });

  // Join a chat room (only authenticated users can join)
  socket.on("join_chat", (chatId) => {
    if (!socket.user._id) {
      return socket.emit("unauthenticated", "Please authenticate first");
    }
    socket.join(chatId);
    console.log(`User ${socket.user._id} joined chat: ${chatId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
