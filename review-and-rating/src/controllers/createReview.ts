import { Request, Response } from "express";
import Review from "../models/review";

const createReview = async (req: Request, res: Response) => {
  try {
    // Extract productId from URL params
    const { productId } = req.params;

    // Extract userId from auth middleware
    const userId = req.user!.userId;

    const { rating, text } = req.body;

    const review = new Review({ productId, userId, rating, text });
    const savedReview = await review.save();

    return res
      .status(201)
      .json({ review: savedReview, message: "Review created successfully" });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default createReview;
