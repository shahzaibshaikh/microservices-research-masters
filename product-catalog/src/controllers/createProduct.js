const Product = require("../models/product");

const createProduct = async (req, res) => {
  try {
    const { title, description, author, price } = req.body;

    const newProduct = new Product({ title, description, author, price });
    const savedProduct = await newProduct.save();

    res
      .status(201)
      .json({ product: savedProduct, message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = createProduct;
