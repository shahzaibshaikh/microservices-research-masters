const Payment = require("../models/payment");

const processPayment = async value => {
  try {
    const messageData = JSON.parse(value);

    // Extract relevant data from the message
    const orderId = messageData._id;
    const amount = messageData.totalAmount;

    // Check if a payment for the order already exists
    const existingPayment = await Payment.findOne({ orderId });

    if (existingPayment) {
      return console.error(`Payment for order ${orderId} already exists.`);
    }

    const payment = new Payment({ orderId, amount: amount || 0, status: "pending" });
    const savedPayment = await payment.save();

    return savedPayment;
  } catch (error) {
    console.error("Error processing payment:", error);
  }
};

module.exports = processPayment;
