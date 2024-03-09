const KafkaConfig = require("../events/config");

const sendMessageToKafka = async (req, res) => {
  try {
    const { message } = req.body;
    const kafkaConfig = new KafkaConfig();
    const messages = [{ key: "key1", value: message }];
    kafkaConfig.produce("order-created-topic", messages);

    res.status(200).json({
      status: "Ok!",
      message: "Message successfully send!"
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMessageToKafka;
