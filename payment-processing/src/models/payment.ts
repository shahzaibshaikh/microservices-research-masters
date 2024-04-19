import mongoose, { Schema, Document, Model } from "mongoose";

interface PaymentInterface extends Document {
  orderId: mongoose.Schema.Types.ObjectId;
  amount: number;
  status: "pending" | "processed";
  createdAt: Date;
}

const paymentSchema: Schema<PaymentInterface> = new Schema({
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

paymentSchema.index({ _id: 1 });

const Payment: Model<PaymentInterface> = mongoose.model<PaymentInterface>(
  "Payment",
  paymentSchema
);

export default Payment;
