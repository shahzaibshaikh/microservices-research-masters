const Shipping = require("../models/shipping");

const getDefaultEstimatedDeliveryDate = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 4); // Adding 4 days to the current date
  return currentDate;
};

const createShipping = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if shipping details for the order already exist
    const existingShipping = await Shipping.findOne({ orderId });

    if (existingShipping) {
      return res
        .status(400)
        .json({ error: "Shipping details for this order already exist" });
    }

    // Create a new shipping record with estimatedDelivery set to 4 days from now
    const shipping = new Shipping({
      orderId,
      estimatedDelivery: getDefaultEstimatedDeliveryDate()
    });

    const savedShipping = await shipping.save();

    res.status(201).json({
      shipping: savedShipping,
      message: "Shipping details created successfully"
    });
  } catch (error) {
    console.error("Error creating shipping details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = createShipping;
