import Payment from "../models/payment";
import { Request, Response } from "express";

const getPaymentByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params; // Extract orderId from URL params

    // Find the payment record by orderId
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found for this order" });
    }

    res.json({ payment, message: "Payment details retrieved successfully" });
  } catch (error) {
    console.error("Error getting payment details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getPaymentByOrderId;
