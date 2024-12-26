// controllers/chatController.js
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export const createChat = async (req, res) => {
  const { recipientId, isGroupChat, name, userId } = req.body;
  try {
    if (!recipientId) {
      return res.status(400).json({ message: "Recipient is required" });
    }

    // Prepare participants array (sender + recipient)
    const participants = [userId, recipientId];

    // Check if a one-on-one chat already exists
    const existingChat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: participants, $size: 2 },
    });

    if (existingChat) {
      return res.status(200).json({
        message: "Chat already exists",
        chat: existingChat,
        issuedBy: userId,
      });
    }

    // Create a new chat
    const chat = await Chat.create({
      participants,
      isGroupChat,
      name: isGroupChat ? name : undefined,
    });

    res.status(201).json({
      message: "Chat created successfully",
      chat: chat,
      issuedBy: userId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChats = async (req, res) => {
  const { chatId } = req.params; // Extract chatId from the URL parameter
  const { userId } = req.body; // Extract userId from the request body

  try {
    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" }); // If no chatId provided
    }

    const chat = await Chat.findById(chatId).populate("participants");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" }); // If no chat is found for the given chatId
    }

    // Check if the user is part of the chat
    if (
      !chat.participants.some(
        (participant) => participant._id.toString() === userId.toString()
      )
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to this chat" });
    }

    // Fetch all messages for this chat
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "_id") // Only populate the sender's _id
      .sort({ createdAt: 1 }); // Sort messages by creation time in ascending order

    // Send the chat along with messages
    res.status(200).json({ messages }); // Return both chat and messages
  } catch (error) {
    res.status(500).json({ message: error.message }); // Server error
  }
};

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  try {
    const message = await Message.create({
      sender: req.user.id,
      content,
      chat: chatId,
    });

    // Update the latest message in the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
