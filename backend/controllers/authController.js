import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookie from "cookie";

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: password,
    });

    await newUser.save(); // Save the user to the database

    // Generate a JWT token for the new user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Set the token in the response cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true, // Prevent JavaScript access to the token
        sameSite: "none", // SameSite cookie policy
        secure: true, // Use secure cookies in production
        maxAge: 60 * 60 * 24, // 1 day
        path: "/", // Available throughout the application
      })
    );

    // Send back the user data without the token in response body
    res.status(201).json({ user: { email: newUser.email } });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error while registering user", error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Set the token in the response cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true, // Prevent JavaScript access to the token
        sameSite: "none",
        secure: true, // Use secure cookies in production
        maxAge: 60 * 60 * 24, // 1 day
        path: "/", // Available throughout the application
      })
    );

    // Send back the user data without the token in response body
    res.status(200).json({ user: { email: user.email } });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error while logging in", error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      expires: new Date(0),
      path: "/",
    })
  );
  res.status(200).json({ message: "Logged out" });
};
