import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { userName }] });
    if (userExists) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ userName, email, password: hashedPassword });

    const token = genToken(user._id);
    if (!token) return res.status(500).json({ message: "Token creation failed" });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None" ,
      secure: true,
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      userName: user.userName,
    });
  } catch (error) {
    console.error("Signup error →", error);
    res.status(500).json({ message: `Signup error: ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = genToken(user._id);
    if (!token) return res.status(500).json({ message: "Token creation failed" });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite:"None",
      secure: true,
    });

    res.status(200).json({
      _id: user._id,
      email: user.email,
      userName: user.userName,
    });
  } catch (error) {
    console.error("Login error →", error);
    res.status(500).json({ message: `Login error: ${error.message}` });
  }
};

export const logOut = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: `Logout error: ${error.message}` });
  }
};
