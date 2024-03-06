// shippingSchema.js (updated shipping and logistics service schema with default estimatedDelivery)

const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  status: { type: String, default: "pending" },
  estimatedDelivery: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const Shipping = mongoose.model("Shipping", shippingSchema);

module.exports = Shipping;
