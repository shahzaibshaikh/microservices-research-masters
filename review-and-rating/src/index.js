require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
const createReview = require("./controllers/createReview");
const getAllReviews = require("./controllers/getAllReviews");

const app = express();

// middlwares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

// routes
app.post("/api/reviews/:productId", auth, createReview);
app.get("/api/reviews", getAllReviews);

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
