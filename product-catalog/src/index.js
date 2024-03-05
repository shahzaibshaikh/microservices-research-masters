require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
import createProduct from "./controllers/createProduct";
import getAllProducts from "./controllers/getAllProducts";
import getProduct from "./controllers/getProduct";

const app = express();

// middlwares
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(bodyParser.json());

app.get("/api/products", (req, res) => {
  res.send("<h1>Product Catalog Service is Running!</h1>");
});

// routes
app.post("/api/products/", createProduct);
app.get("/api/products/", getAllProducts);
app.get("/api/products/:id", getProduct);

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
