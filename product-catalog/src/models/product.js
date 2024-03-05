const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: "Book" },
  description: { type: String, required: true },
  image: { type: String, required: false },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now() }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
