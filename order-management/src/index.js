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
const nats = require("node-nats-streaming");
const { auth } = require("@shahzaibshaikh-research-bookstore/common");

const app = express();

// middlwares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

// routes
app.post("/api/orders", auth, createOrder);
app.get("/api/orders", getAllOrders);
app.get("/api/orders/:orderId", getOrderById);
app.put("/api/orders/:orderId", auth, updateOrder);
app.delete("/api/orders/:orderId", auth, deleteOrder);

// NATS Streaming Listener
const clusterId = "microservices-research"; // Replace with your cluster ID
const clientId = "order-listener"; // Unique client ID for this listener

const stan = nats.connect(clusterId, clientId, {
  url: "nats://nats-srv:4222" // Replace with your NATS server URL
});

stan.on("connect", () => {
  console.log(`${clientId} connected to NATS Streaming`);

  const subscription = stan.subscribe("order-created-topic");

  subscription.on("message", msg => {
    console.log("Message received!");
  });
});

// DB connection and service starting
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_ORDER);
    console.log("Connected to Orders database.");
  } catch (err) {
    console.error(err);
  }

  const PORT = 3003;

  app.listen(PORT, () => {
    console.log(`OrderManagement service running on port ${PORT}`);
  });
};

start();
