const bcrypt = require("bcrypt");
const User = require("../models/user");

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

    user = { id: user._id, email: user.email };
    // Add any additional logic for user authentication, such as generating tokens

    res.status(200).json({ user, message: "User signed in successfully" });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = signIn;
