const Product = require("../models/product");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getAllProducts;
