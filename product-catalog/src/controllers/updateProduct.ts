import Product from "../models/product";
import { Request, Response } from "express";

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, author, price } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { title, description, author, price } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res
      .status(200)
      .json({ product: updatedProduct, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default updateProduct;
