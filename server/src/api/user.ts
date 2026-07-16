import express, { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { createToken, JWT_EXPIRES_LABEL } from "../config/jwt.js";
import User from "../model/User.js";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({
        message: "name, username, and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "password must be at least 8 characters long",
      });
    }

    if (username.length < 4) {
      return res.status(400).json({
        message: "username must be at least 4 characters long",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
    });

    const token = createToken(user._id.toString());

    res.status(201).json({
      token,
      expiresIn: JWT_EXPIRES_LABEL,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
      },
    });
    console.log(`User registered: ${user}`);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "username and password are required",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = createToken(user._id.toString());

    res.status(200).json({
      token,
      expiresIn: JWT_EXPIRES_LABEL,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
      },
    });
    console.log(`User logged in: ${user}`);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

export default router;
