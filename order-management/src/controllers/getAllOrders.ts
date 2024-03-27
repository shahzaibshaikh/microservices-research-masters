import { Request, Response } from "express";
import Order, { OrderDocument } from "../models/order";

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders: OrderDocument[] = await Order.find();
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllOrders;
