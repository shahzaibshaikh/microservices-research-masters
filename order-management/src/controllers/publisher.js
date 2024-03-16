const nats = require("node-nats-streaming");

const publisher = (clientId, topic, eventData, clusterId = "microservices-research") => {
  const stan = nats.connect(clusterId, clientId, {
    url: "nats://nats-srv:4222"
  });

  stan.on("connect", () => {
    console.log(`${clientId} connected to NATS Streaming`);

    // Publish event
    stan.publish(topic, JSON.stringify(eventData), () => {
      console.log("Event Published!");
      // Close the connection after publishing the event
      stan.close();
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

module.exports = publisher;
