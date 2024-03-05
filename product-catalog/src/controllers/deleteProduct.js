const Product = require("../models/product");

const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting product by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = deleteProduct;
