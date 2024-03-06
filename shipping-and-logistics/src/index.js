require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
const createShipping = require("./controllers/createShipping");
const updateShippingStatus = require("./controllers/updateShippingStatus");
const getShippingByOrderId = require("./controllers/getShippingByOrderId");
const app = express();

// middlwares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

// routes
app.post("/api/shipping/:orderId", auth, createShipping);
app.put("/api/shipping/:orderId", auth, updateShippingStatus);
app.get("/api/shipping/:orderId", auth, getShippingByOrderId);

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
