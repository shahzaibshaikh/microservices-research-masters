import dotenv from "dotenv";
dotenv.config();

import { auth } from "@shahzaibshaikh-research-bookstore/common";
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
app.post("/api/shipping/:orderId", auth, createShipping);
app.put("/api/shipping/:orderId", auth, updateShippingStatus);
app.get("/api/shipping/:orderId", auth, getShippingByOrderId);

// DB connection and service starting
const start = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI_SHIPPING || "");
    console.log("Connected to Shipping database.");
  } catch (err) {
    console.error(err);
  }

  const PORT: number = 3005;

  app.listen(PORT, () => {
    console.log(`ShippingAndLogistics service running on port ${PORT}`);
  });
};

start();
