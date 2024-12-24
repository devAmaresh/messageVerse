// controllers/chatController.js
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export const createChat = async (req, res) => {
  const { participants, isGroupChat, name } = req.body;

  try {
    const chat = await Chat.create({
      participants,
      isGroupChat,
      name: isGroupChat ? name : undefined,
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("participants", "name email")
      .populate("latestMessage");

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
