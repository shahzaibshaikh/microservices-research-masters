import Order, { OrderDocument } from "../models/order";

const completePayment = async (value: string) => {
  try {
    const messageData = JSON.parse(value);

    // Extract relevant data from the message
    const paymentId = messageData._id;
    const paymentDate = messageData.createdAt;
    const paymentStatus = messageData.status;
    const orderId = messageData.orderId;
    const status = "success";

    const updatedOrder: OrderDocument | null = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: { status, paymentDetails: { paymentId, paymentDate, paymentStatus } }
      },
      { new: true }
    );

    if (!updatedOrder) {
      console.log("Order not found");
      return;
    }
    console.log({ message: `Payment details for order ${orderId} updated.` });
    return updatedOrder;
  } catch (error) {
    console.error("Error updating order:", error);
  }
};

export default completePayment;
