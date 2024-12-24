// src/models/chatModel.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    isGroupChat: { type: Boolean, default: false },
    name: { type: String, required: function () { return this.isGroupChat; } }, // Group chat name
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users in the chat
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Reference to the latest message
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
