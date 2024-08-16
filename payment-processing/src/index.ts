import dotenv from "dotenv";
dotenv.config();

import { auth, publisher, subscriber } from "@shahzaibshaikh-research-bookstore/common";
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import getPaymentByOrderId from "./controllers/getPaymentByOrderId";
import updatePaymentStatus from "./controllers/updatePaymentStatus";
import processPayment from "./controllers/processPayment";

const app = express();

// middlwares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

// routes
app.put("/api/payments/:orderId", auth, updatePaymentStatus);
app.get("/api/payments/:orderId", auth, getPaymentByOrderId);

// handling order created event
const processOrderCreatedEvent = async (msg: any) => {
  const message = msg.getData();
  console.log("Received event in payments:", message);
  const paymentDetails = await processPayment(message);
  publisher("payment-publisher", "payment-created-topic", paymentDetails);
  console.log({
    message: `Payment created event for ${paymentDetails?.orderId} created`
  });
};

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_PAYMENT || "", {
      maxPoolSize: 50, // Adjust to your needs; default is 100
      minPoolSize: 10, // Adjust to your needs; default is 0
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if the server isn't responding
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log("Connected to Payments database.");
    subscriber("order-listener", "order-created-topic", processOrderCreatedEvent);
  } catch (err) {
    console.error(err);
  }

  const PORT: number = 3004;

  app.listen(PORT, () => {
    console.log(`PaymentProcessing service running on port ${PORT}`);
  });
};

start();
