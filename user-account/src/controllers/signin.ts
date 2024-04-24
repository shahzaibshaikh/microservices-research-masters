import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { Request, Response } from "express";

const SECRET_KEY: string | undefined = process.env.SECRET_KEY;

const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch: boolean = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    if (!SECRET_KEY) throw new Error("Secret key is not provided");
    const token: string = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "24h" // Token expiration time
    });

    const userWithoutPassword = { id: user._id, email: user.email };

    // Add any additional logic for user authentication

    res
      .status(200)
      .json({
        user: userWithoutPassword,
        token,
        message: "User signed in successfully, 24 hours."
      });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default signIn;
