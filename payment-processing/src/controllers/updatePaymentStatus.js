const Payment = require("../models/payment");

const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params; // Extract orderId from URL params
    const { status } = req.body;

    // Find the payment record by orderId
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Update the payment status
    payment.status = status;
    const updatedPayment = await payment.save();

    res.json({ payment: updatedPayment, message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = updatePaymentStatus;
