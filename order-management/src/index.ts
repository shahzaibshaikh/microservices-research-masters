import { auth, publisher, subscriber } from "@shahzaibshaikh-research-bookstore/common";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import addPaymentDetails from "./controllers/addPaymentDetails";
import completePayment from "./controllers/completePayment";
import createOrder from "./controllers/createOrder";
import deleteOrder from "./controllers/deleteOrder";
import getAllOrders from "./controllers/getAllOrders";
import getOrderById from "./controllers/getOrderById";
import updateOrder from "./controllers/updateOrder";
import addShippingDetails from "./controllers/addShippingDetails";

dotenv.config();

const app = express();

// Middlewares
app.use(bodyParser.json());
app.set("trust proxy", true);

// Routes
app.post("/api/orders/publish", (req: Request, res: Response) => {
  publisher("order-publisher", "order-created-topic", req.body);
  res.status(200).json({ message: "event published from index.js" });
});
app.post("/api/orders", auth, createOrder);
app.get("/api/orders", getAllOrders);
app.get("/api/orders/:orderId", getOrderById);
app.put("/api/orders/:orderId", auth, updateOrder);
app.delete("/api/orders/:orderId", auth, deleteOrder);

const processPaymentCreatedEvent = async (msg: any) => {
  const message = msg.getData();
  console.log("Received event in orders:", message);
  const updatedOrder = await addPaymentDetails(message);
  console.log(updatedOrder);
};

const processPaymentCompletedEvent = async (msg: any) => {
  const message = msg.getData();
  console.log("Received event in orders:", message);
  const updatedOrder = await completePayment(message);
  console.log(updatedOrder);
};

const processShippingCreatedEvent = async (msg: any) => {
  const message = msg.getData();
  console.log("Received event in orders:", message);
  const updatedOrder = await addShippingDetails(message);
  console.log(updatedOrder);
};

// DB connection and service starting
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_ORDER || "");
    console.log("Connected to Orders database.");
    subscriber(
      "payment-creation-listener",
      "payment-created-topic",
      processPaymentCreatedEvent
    );
    subscriber(
      "payment-completion-listener",
      "payment-completed-topic",
      processPaymentCompletedEvent
    );
    subscriber(
      "shipping-created-listener",
      "shipping-created-topic",
      processShippingCreatedEvent
    );
  } catch (err) {
    console.error(err);
  }

  const PORT = 3003;

  app.listen(PORT, () => {
    console.log(`OrderManagement service running on port ${PORT}`);
  });
};

start();
