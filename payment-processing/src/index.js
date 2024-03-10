require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const processPayment = require("./controllers/processPayment");
const updatePaymentStatus = require("./controllers/updatePaymentStatus");
const getPaymentByOrderId = require("./controllers/getPaymentByOrderId");
const { auth, KafkaConfig } = require("@shahzaibshaikh-research-bookstore/common");
const app = express();

// middlwares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

// routes
app.put("/api/payments/:orderId", auth, updatePaymentStatus);
app.get("/api/payments/:orderId", auth, getPaymentByOrderId);

// Kafka configuration and consumer
// const kafkaConfig = new KafkaConfig();
// kafkaConfig.consume("order-created-topic", async (value) => {
//   try {
//     const paymentResult = await processPayment(value);
//     console.log("Payment processed:", paymentResult);

//     // Extract data for event (assuming relevant fields exist)
//     const orderId = paymentResult.orderId
//     const paymentId = paymentResult._id;
//     const paymentStatus = paymentResult.status;
//     const paymentDate = paymentResult.createdAt;

//     const message = {
//       orderId,
//       paymentId,
//       paymentStatus,
//       paymentDate,
//     };

//     await kafkaConfig.produce("payment-created-topic", [{ value: JSON.stringify(message) }]);
//     console.log("Payment created event published!");

//   } catch (err) {
//     console.error("Payment processing error:", err);
//   }
// });

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
