const Payment = require("../models/payment");

const processPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount } = req.body;

    // Check if a payment for the order already exists
    const existingPayment = await Payment.findOne({ orderId });

    if (existingPayment) {
      return res.status(400).json({ error: "Payment for this order already exists" });
    }

    // Create a new payment record
    const payment = new Payment({ orderId, amount, status: "pending" });
    const savedPayment = await payment.save();

    res
      .status(201)
      .json({ payment: savedPayment, message: "Payment entry created successfully" });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = processPayment;
