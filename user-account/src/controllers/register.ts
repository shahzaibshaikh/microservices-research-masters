import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { Request, Response } from "express";

const saltRounds: number = 10; // Number of salt rounds for bcrypt
const SECRET_KEY: string | undefined = process.env.SECRET_KEY;

const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    // Create a new user with hashed password
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    if (!SECRET_KEY) throw new Error("Secret key is not provided");
    const token: string = jwt.sign(
      { userId: newUser._id, email: newUser.email }, SECRET_KEY);

    const userWithoutPassword = { id: newUser._id, email: newUser.email };

    res.status(201).json({
      user: userWithoutPassword,
      token,
      message: "User registered successfully"
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default register;
