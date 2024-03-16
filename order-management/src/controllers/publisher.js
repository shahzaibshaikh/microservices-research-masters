const nats = require("node-nats-streaming");

const publisher = eventData => {
  const clusterId = "microservices-research"; // Replace with your cluster ID
  const clientId = "order-publisher"; // Unique client ID for this service
  const stan = nats.connect(clusterId, clientId, {
    url: "nats://nats-srv:4222" // Replace with your NATS server URL
  });

  stan.on("connect", () => {
    console.log("Publisher connected to NATS Streaming");

    // Publish event
    stan.publish("order-created-topic", JSON.stringify(eventData), () => {
      console.log("Event Published!");

      // Close the connection after publishing the event
      stan.close();
    });
  });
};

module.exports = publisher;
