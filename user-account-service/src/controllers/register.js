const bcrypt = require("bcrypt");
const User = require("../models/user");

const saltRounds = 10; // Number of salt rounds for bcrypt

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with hashed password
    let newUser = new User({ email, password: hashedPassword });
    newUser = await newUser.save();

    const user = { id: newUser._id, email: newUser.email };

    res.status(201).json({ user, message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = register;
