const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processed"],
    default: "pending",
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
