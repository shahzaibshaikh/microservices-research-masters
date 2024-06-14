import { Request, Response } from "express";
import Review from "../models/review";

const getAllReviewsByProductId = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).limit(10);

    return res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews by productId:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllReviewsByProductId;
