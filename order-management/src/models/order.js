const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true },
      amount: {type: Number, required: true}
    }
  ],
  totalQuantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentDetails: {
    paymentId: { type: mongoose.Schema.Types.ObjectId },
    paymentStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    paymentDate: { type: Date },
  },
  // shippingDetails: {
  //   shippingId: { type: String },
  //   shippingStatus: { type: String, enum: ["Pending", "Shipped", "Delivered"], default: "Pending" },
  //   shippingDate: { type: Date },
  // },
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "success"],
    default: "pending",
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
