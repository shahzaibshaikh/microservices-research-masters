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
const { auth, KafkaConfig } = require("@shahzaibshaikh-research-bookstore/common");

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


const kafkaConfig = new KafkaConfig();

kafkaConfig.consume('order-created-topic', async (message) => {
  try {
    const order = JSON.parse(message);
    console.log(`Received order: ${JSON.stringify(order)}`);

  } catch (error) {
    console.error('Error processing received order:', error);
  }
});


// const kafkaConfig = new KafkaConfig();
// kafkaConfig.consume("payment-created-topic", async (value) => {
//   try {
//     const paymentData = JSON.parse(value);
//     const { orderId, paymentId, paymentStatus, paymentDate } = paymentData;

//     console.log("Payment created event received in order:", paymentData);

//     // Update order with payment details
//     await updateOrderWithPayment(orderId, paymentId, paymentStatus, paymentDate);
//   } catch (err) {
//     console.error("Error processing payment created event:", err);
//     // Handle errors appropriately (e.g., log, retry)
//   }
// });

// const updateOrderWithPayment = async (orderId, paymentId, paymentStatus, paymentDate) => {
//   const updatedOrder = await Order.findByIdAndUpdate(
//     orderId,
//     {
//       $set: {
//         paymentDetails: { paymentId, paymentStatus, paymentDate },
//       },
//       $setOnInsert: { orderStatus: "processing" },
//     },
//     { new: true }
//   );

//   if (!updatedOrder) {
//     console.warn("Order not found for payment update:", orderId);
//     return;
//   }

//   console.log("Order updated with payment details:", updatedOrder._id);
// };


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
