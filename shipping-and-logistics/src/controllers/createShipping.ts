import { Request, Response } from "express";
import Shipping from "../models/shipping";

const getDefaultEstimatedDeliveryDate = (): Date => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 4); // Adding 4 days to the current date
  return currentDate;
};

const createShipping = async (value: string) => {
  try {
    const messageData = JSON.parse(value);

    // Extract relevant data from the message
    const orderId = messageData.orderId;
    const paymentId = messageData._id;

    // Check if shipping details for the order already exist
    const existingShipping = await Shipping.findOne({ orderId });

    if (existingShipping) {
      console.log({ error: "Shipping details for this order already exist" });
      return;
    }

    // Create a new shipping record with estimatedDelivery set to 4 days from now
    const shipping = new Shipping({
      orderId,
      paymentId,
      estimatedDelivery: getDefaultEstimatedDeliveryDate()
    });

    const savedShipping = await shipping.save();

    console.log({
      shipping: savedShipping,
      message: "Shipping details created successfully"
    });
    return;
  } catch (error) {
    console.error("Error creating shipping details:", error);
    return;
  }
};

export default createShipping;
