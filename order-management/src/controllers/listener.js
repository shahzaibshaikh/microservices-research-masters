const nats = require("node-nats-streaming");

const listener = (
  clientId,
  topic,
  processEvent,
  queueGroup = null,
  clusterId = "microservices-research"
) => {
  const stan = nats.connect(clusterId, clientId, {
    url: "nats://nats-srv:4222" // Replace with your NATS server URL
  });

  stan.on("connect", () => {
    console.log(`${clientId} connected to NATS Streaming`);

    // Subscribe to the subject with the optional queue group
    const subscription = stan.subscribe(topic, queueGroup);

    subscription.on("message", msg => {
      // Process the message using the provided function
      processEvent(msg);
    });
  });

  // Handle error events
  stan.on("error", err => {
    console.error(`${clientId} encountered an error:`, err);
  });

  // Handle close events
  stan.on("close", () => {
    console.log(`${clientId} connection closed`);
  });
};

module.exports = listener;
