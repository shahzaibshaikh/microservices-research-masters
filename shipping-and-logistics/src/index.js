require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
const processPayment = require("./controllers/processPayment");
const updatePaymentStatus = require("./controllers/updatePaymentStatus");
const getPaymentByOrderId = require("./controllers/getPaymentByOrderId");
const app = express();

// middlwares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

// routes
app.post("/api/payments/:orderId", auth, processPayment);
app.put("/api/payments/:orderId", auth, updatePaymentStatus);
app.get("/api/payments/:orderId", auth, getPaymentByOrderId);

// DB connection and service starting
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_SHIPPING);
    console.log("Connected to Shipping database.");
  } catch (err) {
    console.error(err);
  }

  const PORT = 3005;

  app.listen(PORT, () => {
    console.log(`ShippingAndLogistics service running on port ${PORT}`);
  });
};

start();
