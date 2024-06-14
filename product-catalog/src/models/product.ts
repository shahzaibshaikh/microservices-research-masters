import mongoose, { Schema, Document, Model } from "mongoose";

interface ProductInterface extends Document {
  title: string;
  type: string;
  description: string;
  image?: string;
  author: string;
  price: number;
  status: "available" | "on-hold" | "sold";
  createdAt: Date;
}

const productSchema: Schema<ProductInterface> = new Schema({
  title: { type: String, required: true },
  type: { type: String, default: "Book" },
  description: { type: String, required: true },
  image: { type: String, required: false },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["available", "on-hold", "sold"], default: "available" },
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ _id: 1 });

const Product: Model<ProductInterface> = mongoose.model<ProductInterface>(
  "Product",
  productSchema
);

export default Product;
