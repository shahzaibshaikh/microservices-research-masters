import { Request, Response } from "express";
import Order, { OrderDocument } from "../models/order";
import { publisher } from "@shahzaibshaikh-research-bookstore/common";

interface Product {
  quantity: number;
  amount: number;
}

const createOrder = async (req: Request, res: Response) => {
  try {
    // Check if req.user exists and has a userId property
    const userId: string | undefined = req.user!.userId;

    // If userId is not present or not a string, return an error response
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const { products }: { products: Product[] } = req.body;

    // Calculate total price based on products and quantity
    const totalQuantity: number = products.reduce((total, product) => {
      return total + product.quantity;
    }, 0);

    const totalAmount: number = products.reduce((total, product) => {
      return total + product.amount * product.quantity;
    }, 0);

    const newOrder: OrderDocument = new Order({
      userId,
      products,
      totalQuantity,
      totalAmount
    });
    const savedOrder: OrderDocument = await newOrder.save();
    publisher("order-publisher", "order-created-topic", savedOrder);
    return res
      .status(201)
      .json({ order: savedOrder, message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default createOrder;
