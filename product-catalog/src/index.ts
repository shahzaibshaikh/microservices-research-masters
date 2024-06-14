import dotenv from "dotenv";
dotenv.config();

import { auth } from "@shahzaibshaikh-research-bookstore/common";
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import createProduct from "./controllers/createProduct";
import deleteProduct from "./controllers/deleteProduct";
import getAllProducts from "./controllers/getAllProducts";
import getProductById from "./controllers/getProductById";
import updateProduct from "./controllers/updateProduct";

const app = express();

// middlwares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

// routes
app.post("/api/products", auth, createProduct);
app.get("/api/products", getAllProducts);
app.get("/api/products/:id", getProductById);
app.delete("/api/products/:id", auth, deleteProduct);
app.put("/api/products/:id", auth, updateProduct);

// DB connection and service starting
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_PRODUCT || "");
    console.log("Connected to Products database.");
  } catch (err) {
    console.error(err);
  }

  const PORT: number = 3001;

  app.listen(PORT, () => {
    console.log(`ProductCatalog service running on port ${PORT}`);
  });
};

start();
