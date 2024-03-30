import { publisher } from "@shahzaibshaikh-research-bookstore/common";
import Payment from "../models/payment";
import { Request, Response } from "express";

const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params; // Extract orderId from URL params
    const { status } = req.body;

    // Find the payment record by orderId
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Update the payment status
    payment.status = status;
    const updatedPayment = await payment.save();
    publisher("payment-publisher", "payment-completed-topic", updatedPayment);
    console.log({
      message: `Payment completed event for ${updatedPayment?.orderId}`
    });

    res.json({ payment: updatedPayment, message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default updatePaymentStatus;
