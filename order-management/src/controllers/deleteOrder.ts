import { Request, Response } from "express";
import Order, { OrderDocument } from "../models/order";

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const deletedOrder: OrderDocument | null = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default deleteOrder;
