const Review = require("../models/review");

const createReview = async (req, res) => {
  try {
    // Extract productId from URL params
    const { productId } = req.params;

    // Extract userId from auth middleware
    const userId = req.userId;

    const { rating, text } = req.body;

    const review = new Review({ productId, userId, rating, text });
    const savedReview = await review.save();

    res.status(201).json({ review: savedReview, message: "Review created successfully" });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = Review;
