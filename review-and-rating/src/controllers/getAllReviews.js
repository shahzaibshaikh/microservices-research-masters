const Review = require("../models/review");

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getAllReviews;
