import dotenv from "dotenv";
dotenv.config();

import { auth, subscriber } from "@shahzaibshaikh-research-bookstore/common";
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
  console.log(paymentDetails);
};

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_PAYMENT || "");
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
