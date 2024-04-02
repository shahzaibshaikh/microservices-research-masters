import Shipping from "../models/shipping";

const updateShippingStatus = async (value: string) => {
  try {
    const messageData = JSON.parse(value);
    const orderId = messageData.orderId;
    const status = "shipped";

    // Find the shipping details for the specified order
    const shipping = await Shipping.findOne({ orderId });

    if (!shipping) {
      console.log({ error: "Shipping details not found for the specified order" });
      return;
    }

    // Update the shipping status
    shipping.status = status;

    // Save the updated shipping details
    const updatedShipping = await shipping.save();

    return console.log({
      shipping: updatedShipping,
      message: "Shipping status updated successfully"
    });
    return;
  } catch (error) {
    console.error("Error updating shipping status:", error);
    return;
  }
};

export default updateShippingStatus;
