require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
const createReview = require("./controllers/createReview");
const getReviewsByProductId = require("./controllers/getReviewsByProductId");
const deleteReview = require("./controllers/deleteReview");
const updateReview = require("./controllers/updateReview");

const app = express();

// middlwares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

// routes
app.post("/api/reviews/:productId", auth, createReview);
app.get("/api/reviews/:productId", getReviewsByProductId);
app.delete("/api/reviews/:reviewId", auth, deleteReview);
app.put("/api/reviews/:reviewId", auth, updateReview);

// DB connection and service starting
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_REVIEW);
    console.log("Connected to Reviews database.");
  } catch (err) {
    console.error(err);
  }

  const PORT = 3002;

  app.listen(PORT, () => {
    console.log(`ReviewAndRating service running on port ${PORT}`);
  });
};

start();
