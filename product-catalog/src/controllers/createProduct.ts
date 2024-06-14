import Product from "../models/product";
import { Request, Response } from "express";

const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, author, price } = req.body;

    const newProduct = new Product({ title, description, author, price });
    const savedProduct = await newProduct.save();

    return res
      .status(201)
      .json({ product: savedProduct, message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default createProduct;
