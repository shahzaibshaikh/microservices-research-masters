import dotenv from "dotenv";
dotenv.config();

import { auth, subscriber } from "@shahzaibshaikh-research-bookstore/common";
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import createShipping from "./controllers/createShipping";
import getShippingByOrderId from "./controllers/getShippingByOrderId";
import updateShippingStatus from "./controllers/updateShippingStatus";

const app = express();

// middlewares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

// routes
// app.put("/api/shipping/:orderId", auth, updateShippingStatus);
app.get("/api/shipping/:orderId", auth, getShippingByOrderId);

const processPaymentCreatedEvent = async (msg: any) => {
  const message = msg.getData();
  console.log("Received event in shipping:", message);
  const shippingDetails = await createShipping(message);
  console.log(shippingDetails);
};

const processPaymentCompletedEvent = async (msg: any) => {
  const message = msg.getData();
  console.log("Received event in orders:", message);
  const updatedOrder = await updateShippingStatus(message);
  console.log(updatedOrder);
};

// DB connection and service starting
const start = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI_SHIPPING || "");
    console.log("Connected to Shipping database.");
    subscriber(
      "payment-creation-listener-shipping",
      "payment-created-topic",
      processPaymentCreatedEvent
    );
    subscriber(
      "payment-completion-listener-shipping",
      "payment-completed-topic",
      processPaymentCompletedEvent
    );
  } catch (err) {
    console.error(err);
  }

  const PORT: number = 3005;

  app.listen(PORT, () => {
    console.log(`ShippingAndLogistics service running on port ${PORT}`);
  });
};

start();
