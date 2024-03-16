const nats = require("node-nats-streaming");

const subscriber = () => {
  const clusterId = "microservices-research"; // Replace with your cluster ID
  const clientId = "order-subscriber"; // Unique client ID for this service
  const stan = nats.connect(clusterId, clientId, {
    url: "nats://nats-srv:4222" // Replace with your NATS server URL
  });

  stan.on("connect", () => {
    console.log("Subscriber connected to NATS Streaming");

    // Subscribe to the event
    const subscription = stan.subscribe("order-created-topic");

    subscription.on("message", msg => {
      console.log("Received message:", msg.getData());
    });
  });
};

module.exports = subscriber;
