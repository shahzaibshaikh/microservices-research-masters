import mongoose, { Schema, Document, Model } from "mongoose";

interface ReviewInterface extends Document {
  productId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  rating: number;
  text: string;
  createdAt: Date;
}

const reviewSchema: Schema<ReviewInterface> = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

reviewSchema.index({ _id: 1 });

const Review: Model<ReviewInterface> = mongoose.model<ReviewInterface>(
  "Review",
  reviewSchema
);

export default Review;
