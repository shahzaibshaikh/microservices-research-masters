import { Request, Response } from "express";
import Shipping from "../models/shipping";

const updateShippingStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Find the shipping details for the specified order
    const shipping = await Shipping.findOne({ orderId });

    if (!shipping) {
      return res
        .status(404)
        .json({ error: "Shipping details not found for the specified order" });
    }

    // Update the shipping status
    shipping.status = status;

    // Save the updated shipping details
    const updatedShipping = await shipping.save();

    return res.json({
      shipping: updatedShipping,
      message: "Shipping status updated successfully"
    });
  } catch (error) {
    console.error("Error updating shipping status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default updateShippingStatus;
