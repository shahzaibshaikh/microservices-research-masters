require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
const app = express();

// middlwares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

// routes
app.post("/api/payments", auth, createOrder);

// DB connection and service starting
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_PAYMENT);
    console.log("Connected to Payments database.");
  } catch (err) {
    console.error(err);
  }

  const PORT = 3004;

  app.listen(PORT, () => {
    console.log(`PaymentProcessing service running on port ${PORT}`);
  });
};

start();
