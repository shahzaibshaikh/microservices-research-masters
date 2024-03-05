require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const auth = require("./middleware/auth");

const app = express();

// middlwares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>User Account Service is Running!</h1>");
});

// routes
app.post("/register", register);
app.post("/signin", signin);
app.get("/profile", auth, profile);

// DB connection and service starting
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Users database.");
  } catch (err) {
    console.error(err);
  }

  const PORT = 3000;

  app.listen(PORT, () => {
    console.log(`UserAccount service running on port ${PORT}`);
  });
};

start();
