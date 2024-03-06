const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalQuantity: { type: Number, required: true },
  // paymentDetails: {
  //   paymentId: { type: mongoose.Schema.Types.ObjectId },
  //   paymentStatus: { type: String, enum: ["Pending", "Success", "Failed"], default: "Pending" },
  //   paymentDate: { type: Date },
  // },
  // shippingDetails: {
  //   shippingId: { type: String },
  //   shippingStatus: { type: String, enum: ["Pending", "Shipped", "Delivered"], default: "Pending" },
  //   shippingDate: { type: Date },
  // },
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "success"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;