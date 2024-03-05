const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const SECRET_KEY = process.env.SECRET_KEY;

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    let user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h" // Token expiration time
    });

    user = { id: user._id, email: user.email };

    // Add any additional logic for user authentication

    res.status(200).json({ user, token, message: "User signed in successfully" });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = signIn;
