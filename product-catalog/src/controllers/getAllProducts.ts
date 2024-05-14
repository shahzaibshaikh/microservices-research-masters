import Product from "../models/product";
import { Request, Response } from "express";

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().limit(20);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllProducts;
