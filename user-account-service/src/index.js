require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const register = require("./controllers/register");
const signin = require("./controllers/signin");

const app = express();

app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>User Account Service is Running!</h1>");
});

app.post("/api/register", register);
app.post("/api/signin", signin);

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
