import dotenv from "dotenv";
dotenv.config();

import { auth } from "@shahzaibshaikh-research-bookstore/common";
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import createReview from "./controllers/createReview";
import deleteReview from "./controllers/deleteReview";
import getReviewsByProductId from "./controllers/getReviewsByProductId";
import updateReview from "./controllers/updateReview";

const app = express();

// middlewares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

// routes
app.post("/api/reviews/:productId", auth, createReview);
app.get("/api/reviews/:productId", getReviewsByProductId);
app.delete("/api/reviews/:reviewId", auth, deleteReview);
app.put("/api/reviews/:reviewId", auth, updateReview);

// DB connection and service starting
const start = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI_REVIEW || "", {
      maxPoolSize: 50, // Adjust to your needs; default is 100
      minPoolSize: 10, // Adjust to your needs; default is 0
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if the server isn't responding
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log("Connected to Reviews database.");
  } catch (err) {
    console.error(err);
  }

  const PORT: number = 3002;

  app.listen(PORT, () => {
    console.log(`ReviewAndRating service running on port ${PORT}`);
  });
};

start();
