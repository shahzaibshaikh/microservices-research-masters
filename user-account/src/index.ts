import dotenv from "dotenv";
dotenv.config();

import { auth } from "@shahzaibshaikh-research-bookstore/common";
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import profile from "./controllers/profile";
import register from "./controllers/register";
import signin from "./controllers/signin";

const app = express();

// middlewares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

app.get("/api/users", (req, res) => {
  res.send("<h1>User Account Service is Running!</h1>");
});

// routes
app.post("/api/users/register", register);
app.post("/api/users/signin", signin);
app.get("/api/users/profile", auth, profile);

// DB connection and service starting
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_USER || "");
    console.log("Connected to Users database.");
  } catch (err) {
    console.error(err);
  }

  const PORT: number = 3006;

  app.listen(PORT, () => {
    console.log(`User Account service running on port ${PORT}`);
  });
};

start();
