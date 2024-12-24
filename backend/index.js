import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend to connect
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // When a message is sent
  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("typing", () => {
    io.emit("typing", socket.id);
  });
  socket.on("stop_typing", () => {
    io.emit("stop_typing", socket.id);
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
