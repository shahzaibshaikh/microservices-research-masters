const { KafkaConfig } = require("@shahzaibshaikh-research-bookstore/common");
const Order = require("../models/order");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { products } = req.body;
    // Calculate total price based on products and quantity
    const totalQuantity = products.reduce((total, product) => {
      return total + product.quantity;
    }, 0);

    const newOrder = new Order({ userId, products, totalQuantity });
    const savedOrder = await newOrder.save();

    const kafkaConfig = new KafkaConfig();
    const messages = [{ key: "key1", value: JSON.stringify(savedOrder) }];
    kafkaConfig.produce("order-created-topic", messages)
        .then(() => console.log("Messages published successfully in Order service!"))
        .catch((error) => console.error("Error producing messages:", error));

    res.status(201).json({ order: savedOrder, message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = createOrder;
