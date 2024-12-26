import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const getAllUsers = async (req, res) => {
  try {
    // Retrieve the current user ID from the cookie (assuming the cookie is named 'userId')
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decoded.id;

    if (!currentUserId) {
      return res.status(400).json({ message: "User ID not found in cookies" });
    }

    // Find all users except the current user
    const users = await User.find(
      { _id: { $ne: currentUserId } }, // Exclude the current user
      "_id name email" // Specify fields to return
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
