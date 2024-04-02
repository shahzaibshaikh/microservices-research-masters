import mongoose, { Schema, Document, Model } from "mongoose";

interface ShippingInterface extends Document {
  orderId: mongoose.Schema.Types.ObjectId;
  paymentId: mongoose.Schema.Types.ObjectId;
  status: "pending" | "transit" | "shipped";
  estimatedDelivery: Date;
  createdAt: Date;
}

const shippingSchema: Schema<ShippingInterface> = new Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  status: {
    type: String,
    enum: ["pending", "transit", "shipped"],
    default: "pending",
    required: true
  },
  estimatedDelivery: { type: Date, required: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Shipping: Model<ShippingInterface> = mongoose.model<ShippingInterface>(
  "Shipping",
  shippingSchema
);

export default Shipping;
