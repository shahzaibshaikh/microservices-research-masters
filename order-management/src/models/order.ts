import mongoose, { Document, Schema } from "mongoose";

interface Product {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  amount: number;
}

interface PaymentDetails {
  paymentId?: mongoose.Schema.Types.ObjectId;
  paymentStatus?: "pending" | "processed";
  paymentDate?: Date;
}

interface OrderDocument extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  products: Product[];
  totalQuantity: number;
  totalAmount: number;
  paymentDetails: PaymentDetails;
  shippingId: mongoose.Schema.Types.ObjectId;
  status: "pending" | "processing" | "success";
  createdAt: Date;
}

const orderSchema = new Schema<OrderDocument>({
  userId: { type: Schema.Types.ObjectId, required: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true },
      amount: { type: Number, required: true }
    }
  ],
  totalQuantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentDetails: {
    paymentId: { type: Schema.Types.ObjectId },
    paymentStatus: {
      type: String,
      enum: ["pending", "processed"]
    },
    paymentDate: { type: Date }
  },
  status: {
    type: String,
    enum: ["pending", "processing", "success"],
    default: "pending",
    required: true
  },
  shippingId: { type: Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model<OrderDocument>("Order", orderSchema);

export { OrderDocument };
export default Order;
