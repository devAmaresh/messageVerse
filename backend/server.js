import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import cookieParser from "cookie-parser";
// Import routes
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// Import middleware
import { protect } from "./middlewares/authMiddleware.js";

// Configure environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", protect, chatRoutes); // Protect chat routes with authentication middleware

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend to connect
  },
});

io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);

  // Handle message sending
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  // Handle typing indicators
  socket.on("typing", (chatId) => {
    socket.broadcast.emit("typing", { chatId, userId: socket.id });
  });

  socket.on("stop_typing", (chatId) => {
    socket.broadcast.emit("stop_typing", { chatId, userId: socket.id });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
