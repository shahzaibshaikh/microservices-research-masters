const Shipping = require("../models/shipping");

const getShippingByOrderId = async (req, res) => {
  try {
    // Extract orderId from URL params
    const { orderId } = req.params;

    // Find shipping details by orderId
    const shippingDetails = await Shipping.findOne({ orderId });

    if (!shippingDetails) {
      return res.status(404).json({ error: "Shipping details not found for this order" });
    }

    res
      .status(200)
      .json({
        shipping: shippingDetails,
        message: "Shipping details retrieved successfully"
      });
  } catch (error) {
    console.error("Error fetching shipping details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getShippingByOrderId;
