import { Request, Response } from "express";
import Shipping from "../models/shipping";

const getShippingByOrderId = async (req: Request, res: Response) => {
  try {
    // Extract orderId from URL params
    const { orderId } = req.params;

    // Find shipping details by orderId
    const shippingDetails = await Shipping.findOne({ orderId });

    if (!shippingDetails) {
      return res.status(404).json({ error: "Shipping details not found for this order" });
    }

    return res.status(200).json({
      shipping: shippingDetails,
      message: "Shipping details retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching shipping details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getShippingByOrderId;
