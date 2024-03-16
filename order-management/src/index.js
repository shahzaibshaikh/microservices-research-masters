require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const createOrder = require("./controllers/createOrder");
const getAllOrders = require("./controllers/getAllOrders");
const getOrderById = require("./controllers/getOrderById");
const deleteOrder = require("./controllers/deleteOrder");
const updateOrder = require("./controllers/updateOrder");
const Order = require("./models/order");
const { auth } = require("@shahzaibshaikh-research-bookstore/common");
const publisher = require("./controllers/publisher");
const subscriber = require("./controllers/listener");

const app = express();
// middlwares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

// Routes
app.post("/api/orders/publish", (req, res) => {
  publisher(req.body);
  res.status(200).json({ message: "event published from index.js" });
});
app.post("/api/orders", auth, createOrder);
app.get("/api/orders", getAllOrders);
app.get("/api/orders/:orderId", getOrderById);
app.put("/api/orders/:orderId", auth, updateOrder);
app.delete("/api/orders/:orderId", auth, deleteOrder);

// DB connection and service starting
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_ORDER);
    console.log("Connected to Orders database.");
    // Start the subscriber
    subscriber();
  } catch (err) {
    console.error(err);
  }

  const PORT = 3003;

  app.listen(PORT, () => {
    console.log(`OrderManagement service running on port ${PORT}`);
  });
};

start();
