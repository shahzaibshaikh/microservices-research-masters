const { Kafka } = require("kafkajs");

class KafkaConfig {
  constructor() {
    this.kafka = new Kafka({
      clientId: "research-bookstore-order",
      brokers: ["kafka-service:9092"],
      retry: {
        initialRetryDelay: 600, // Initial delay in milliseconds before retrying
        maxRetries: 5,         // Maximum number of retries
      },
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "test-group" });
  }

  async produce(topic, messages) {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic: topic,
        messages: messages
      });
    } catch (error) {
      console.error(error);
    } finally {
      await this.producer.disconnect();
    }
  }

  async consume(topic, callback) {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: topic, fromBeginning: true });
    await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value.toString();
          callback(value);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = KafkaConfig;
