import Product from "../models/product";
import { Request, Response } from "express";

const getProduct = async (req: Request, res: Response) => {
  const productId: string = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getProduct;
