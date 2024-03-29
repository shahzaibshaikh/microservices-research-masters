import { Request, Response } from "express";
import Review from "../models/review";

const deleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;

    // Check if the review with the given ID exists
    const existingReview = await Review.findById(reviewId);

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default deleteReview;
