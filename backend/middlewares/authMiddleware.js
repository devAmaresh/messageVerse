import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  // Check if the token exists in the cookies
  if (req.cookies.token) {
    try {
      token = req.cookies.token; // Retrieve token from cookies
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      req.user = await User.findById(decoded.id).select("-password"); // Attach user data to request object
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: "Unauthorized access" }); // Token verification failed
    }
  } else {
    res.status(401).json({ message: "No token provided" }); // Token not found in cookies
  }
};
