import { auth, publisher, subscriber } from "@shahzaibshaikh-research-bookstore/common";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import createOrder from "./controllers/createOrder";
import deleteOrder from "./controllers/deleteOrder";
import getAllOrders from "./controllers/getAllOrders";
import getOrderById from "./controllers/getOrderById";
import updateOrder from "./controllers/updateOrder";

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

// DB connection and service starting
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_ORDER || "");
    console.log("Connected to Orders database.");
    // Start the subscriber
    subscriber("order-listener", "order-created-topic", processEvent);
  } catch (err) {
    console.error(err);
  }

  const PORT = 3003;

  app.listen(PORT, () => {
    console.log(`OrderManagement service running on port ${PORT}`);
  });
};

start();

const processEvent = (msg: any) => {
  // Perform event processing here
  console.log("Received event:", msg.getData());
};
