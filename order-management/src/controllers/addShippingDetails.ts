import Order, { OrderDocument } from "../models/order";

const addShippingDetails = async (value: string) => {
  try {
    const messageData = JSON.parse(value);

    // Extract relevant data from the message
    const shippingId = messageData._id;
    const orderId = messageData.orderId;

    const updatedOrder: OrderDocument | null = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: { shippingId }
      },
      { new: true }
    );

    if (!updatedOrder) {
      console.log("Order not found");
      return;
    }
    console.log({ message: `Shipping details for order ${orderId} updated.` });
    return updatedOrder;
  } catch (error) {
    console.error("Error updating order:", error);
  }
};

export default addShippingDetails;
