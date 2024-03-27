import { Request, Response } from "express";
import Order, { OrderDocument } from "../models/order";

const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order: OrderDocument | null = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getOrderById;
