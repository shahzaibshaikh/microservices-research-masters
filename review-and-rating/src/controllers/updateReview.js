const Review = require("../models/review");

const updateReview = async (req, res) => {
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

    res
      .status(200)
      .json({ review: updatedReview, message: "Review updated successfully" });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = updateReview;
