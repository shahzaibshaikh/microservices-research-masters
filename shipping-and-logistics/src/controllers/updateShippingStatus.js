// updateShippingStatus.js (controller to update shipping status)

const Shipping = require("../models/shipping");

const updateShippingStatus = async (req, res) => {
  try {
    const orderId = req.params;
    const { newStatus } = req.body;

    // Find the shipping details for the specified order
    const shipping = await Shipping.findOne({ orderId });

    if (!shipping) {
      return res
        .status(404)
        .json({ error: "Shipping details not found for the specified order" });
    }

    // Update the shipping status
    shipping.status = newStatus;

    // Save the updated shipping details
    const updatedShipping = await shipping.save();

    res.json({
      shipping: updatedShipping,
      message: "Shipping status updated successfully"
    });
  } catch (error) {
    console.error("Error updating shipping status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = updateShippingStatus;
