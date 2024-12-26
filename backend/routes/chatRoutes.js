// routes/chatRoutes.js
import express from "express";
import {
  createChat,
  getChats,
  sendMessage,
} from "../controllers/chatController.js";

const router = express.Router();

// Create a new chat (group or one-to-one)
router.post("/", createChat);

// Get all chats for the authenticated user
router.get("/:chatId", getChats);

// Send a message to a specific chat
router.post("/message", sendMessage);

export default router;
