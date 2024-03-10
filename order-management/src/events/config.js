const config = {
    brokers: ['kafka-service:9092'], // Replace with your Kafka broker addresses
    groupId: 'test-group',
    retryAttempts: 3, // Number of retries for failed messages
    retryDelay: 1000, // Delay in milliseconds between retries
    topics: {
      orderCreated: 'order-created-topic',
      paymentProcessed: 'payment-processed-topic',
    },
  };

 module.exports = config