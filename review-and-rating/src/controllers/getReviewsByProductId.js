const Review = require("../models/review");

const getAllReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews by productId:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getAllReviewsByProductId;
