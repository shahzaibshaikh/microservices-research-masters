import { Request, Response } from "express";
import Review from "../models/review";

const updateReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { rating, text } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $set: { rating, text } },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    return res
      .status(200)
      .json({ review: updatedReview, message: "Review updated successfully" });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default updateReview;
