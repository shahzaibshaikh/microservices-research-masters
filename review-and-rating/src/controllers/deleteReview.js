const Review = require("../models/review");

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Check if the review with the given ID exists
    const existingReview = await Review.findById(reviewId);

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = deleteReview;
