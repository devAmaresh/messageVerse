import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  // Check if the token exists in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Retrieve token from Authorization header
      token = req.headers.authorization.split(" ")[1]; // Extract token from 'Bearer <token>'

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user data to request object
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" }); // User doesn't exist
      }

      req.user = user; // Attach full user object to request
      req.body.userId = user._id; // Append user ID to the request body

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(401).json({ message: "Unauthorized access" }); // Token verification failed
    }
  } else {
    res.status(401).json({ message: "No token provided" }); // Token not found in Authorization header
  }
};
