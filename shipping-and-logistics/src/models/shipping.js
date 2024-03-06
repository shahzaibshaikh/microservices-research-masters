// shippingSchema.js (updated shipping and logistics service schema with default estimatedDelivery)

const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  status: {
    type: String,
    enum: ["pending", "transit", "shipped"],
    default: "pending",
    required: true
  },
  estimatedDelivery: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Shipping = mongoose.model("Shipping", shippingSchema);

module.exports = Shipping;
