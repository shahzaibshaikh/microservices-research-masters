const Order = require("../models/order");
const nats = require("node-nats-streaming");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { products } = req.body;
    // Calculate total price based on products and quantity
    const totalQuantity = products.reduce((total, product) => {
      return total + product.quantity;
    }, 0);

    const totalAmount = products.reduce((total, product) => {
      return total + product.amount * product.quantity;
    }, 0);

    const newOrder = new Order({ userId, products, totalQuantity, totalAmount });
    const savedOrder = await newOrder.save();

    const clusterId = "microservices-research"; // Replace with your cluster ID
    const clientId = "order-service"; // Unique client ID for this service
    const stan = nats.connect(clusterId, clientId, {
      url: "nats://nats-srv:4222" // Replace with your NATS server URL
    });

    stan.on("connect", () => {
      console.log("Publisher connected to NATS Streaming");
    });

    stan.publish("order-created-topic", JSON.stringify(savedOrder), () => {
      console.log("Event Published!");
      res.status(201).json({ order: savedOrder, message: "Order created successfully" });
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = createOrder;
