var amqp = require("amqplib");
const logger = require("../logger")(process.env.LOG_LEVEL);

class Rabbit {
  constructor(host, queue) {
    this.host = host;
    this.connection = amqp.connect(`amqp://${host}`);

    this.queue = queue;
    this.channel = null;
  }

  async createChannel() {
    this.channel = await this.connection
      .then(conn => {
        return conn.createChannel();
      })
      .then(channel => {
        logger.debug("Channel created");
        return channel
          .assertQueue(this.queue, {
            durable: true,
            autoDelete: true,
          })
          .then(() => {
            logger.debug(`Queue created: ${this.queue}`);
            return channel;
          });
      });
  }

  listen(handler) {
    this.channel.consume(this.queue, handler);
  }

  async send(message) {
    logger.debug(`Sending reply: ${message}`);
    return this.channel.sendToQueue(this.queue, Buffer.from(message));
  }
}

module.exports = Rabbit;
