import { Request, Response } from "express";
import Order, { OrderDocument } from "../models/order";

const updateOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status }: { status: string } = req.body;

    const updatedOrder: OrderDocument | null = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ order: updatedOrder, message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default updateOrder;
