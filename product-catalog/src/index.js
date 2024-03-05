require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
const createProduct = require("./controllers/createProduct");
const getAllProducts = require("./controllers/getAllProducts");
const getProduct = require("./controllers/getProduct");
const deleteProduct = require("./controllers/deleteProduct");

const app = express();

// middlwares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

// routes
app.post("/api/products", createProduct);
app.get("/api/products", getAllProducts);
app.get("/api/products/:id", getProduct);
app.delete("/api/products/:id", deleteProduct);

// DB connection and service starting
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_PRODUCT);
    console.log("Connected to Products database.");
  } catch (err) {
    console.error(err);
  }

  const PORT = 3001;

  app.listen(PORT, () => {
    console.log(`ProductCatalog service running on port ${PORT}`);
  });
};

start();
