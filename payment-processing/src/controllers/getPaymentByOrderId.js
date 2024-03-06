const Payment = require("../models/payment");

const getPaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params; // Extract orderId from URL params

    // Find the payment record by orderId
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found for this order" });
    }

    res.json({ payment, message: "Payment details retrieved successfully" });
  } catch (error) {
    console.error("Error getting payment details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getPaymentByOrderId;
