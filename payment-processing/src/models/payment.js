const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Processed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
