import mongoose, { Schema, Document, Model } from "mongoose";

interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema: Schema<UserInterface> = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 });

const User: Model<UserInterface> = mongoose.model<UserInterface>("User", userSchema);

export default User;
